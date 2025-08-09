import { useCallback } from 'react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const useExportDeliveryLetter = () => {
  const exportPDF = useCallback(async (deliveryLetter) => {
    try {
      const existingPdfBytes = await fetch('/templates/DeliveryLetter.pdf').then(res => res.arrayBuffer())
      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      const { width, height } = firstPage.getSize()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      
      // Layout configuration
      const fontSize = 12
      const lineHeight = 20
      const margin = 50
      const bottomMargin = 70 // More space at bottom
      const columnGap = 20 // Space between columns
      const maxWidth = (width - margin * 2 - columnGap) / 2
      const startY = height - 300 // Below header
      const col1X = margin
      const col2X = margin + maxWidth + columnGap
      const minY = margin + bottomMargin // Minimum Y before switching columns

      // Filter out empty fields
      const fieldData = [
        // COLUMN 1 (left)
        ['Membership No', deliveryLetter?.membershipNo],
        ['Registration No', deliveryLetter?.carDetails?.registrationNo],
        ['Registration Date', deliveryLetter?.carDetails?.registrationDate?.slice(0, 10)],
        ['Chassis No', deliveryLetter?.carDetails?.chassisNo],
        ['Engine No', deliveryLetter?.carDetails?.engineNo],
        ['Make', deliveryLetter?.carDetails?.make],
        ['Model', deliveryLetter?.carDetails?.model],
        ['Color', deliveryLetter?.carDetails?.color],
        ['HP', deliveryLetter?.carDetails?.hp],
        ['Reg Book No', deliveryLetter?.carDetails?.registrationBookNumber],
        
        // COLUMN 2 (right)
        ['Dealer Owner', deliveryLetter?.carDealership?.forDealer?.ownerName],
        ['Salesman Name', deliveryLetter?.carDealership?.forDealer?.salesmanName],
        ['Salesman Card No', deliveryLetter?.carDealership?.forDealer?.salesmanCardNo],
        ['Seller Name', deliveryLetter?.carDealership?.seller?.name],
        ['Seller Address', deliveryLetter?.carDealership?.seller?.address],
        ['Seller Tel', deliveryLetter?.carDealership?.seller?.tel],
        ['Seller NIC', deliveryLetter?.carDealership?.seller?.nic],
        ['Seller Remarks', deliveryLetter?.carDealership?.seller?.remarks],
        ['Purchaser Name', deliveryLetter?.carDealership?.purchaser?.name],
        ['Purchaser Address', deliveryLetter?.carDealership?.purchaser?.address],
        ['Purchaser Tel', deliveryLetter?.carDealership?.purchaser?.tel],
        ['Purchaser NIC', deliveryLetter?.carDealership?.purchaser?.nic],
      ].filter(([_, value]) => value !== undefined && value !== null && value !== '')

      // Improved text drawing with wrapping and newline support
      const drawField = (label, value, x, y) => {
        const fullText = `${label}: ${value}`
        const lines = []
        let currentLine = ''

        // Handle both newlines and word wrapping
        fullText.split('\n').forEach(paragraph => {
          const words = paragraph.split(' ')
          words.forEach(word => {
            const testLine = currentLine ? `${currentLine} ${word}` : word
            const testWidth = font.widthOfTextAtSize(testLine, fontSize)
            
            if (testWidth <= maxWidth) {
              currentLine = testLine
            } else {
              if (currentLine) lines.push(currentLine)
              currentLine = word.length > 0 ? word : ''
            }
          })
          if (currentLine) lines.push(currentLine)
          currentLine = ''
        })

        // Draw all lines
        lines.forEach((line, i) => {
          firstPage.drawText(line, {
            x,
            y: y - (i * lineHeight),
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            maxWidth
          })
        })

        return Math.max(1, lines.length) * lineHeight
      }

      // Track column positions
      let currentYLeft = startY
      let currentYRight = startY

      // Draw fields with smart column balancing
      fieldData.forEach(([label, value]) => {
        // Estimate needed height
        const textLines = `${label}: ${value}`.split('\n')
        const approxLines = textLines.reduce((sum, line) => 
          sum + Math.ceil(font.widthOfTextAtSize(line, fontSize) / maxWidth), 0)
        const neededHeight = Math.max(1, approxLines) * lineHeight

        // Choose column with more space
        const useLeft = currentYLeft - neededHeight >= minY && 
                       (currentYLeft >= currentYRight || currentYRight - neededHeight < minY)

        if (useLeft) {
          const heightUsed = drawField(label, value, col1X, currentYLeft)
          currentYLeft -= heightUsed + (lineHeight / 2)
        } else if (currentYRight - neededHeight >= minY) {
          const heightUsed = drawField(label, value, col2X, currentYRight)
          currentYRight -= heightUsed + (lineHeight / 2)
        } else {
          // If both columns full, reset left column (could add new page instead)
          currentYLeft = startY
          const heightUsed = drawField(label, value, col1X, currentYLeft)
          currentYLeft -= heightUsed + (lineHeight / 2)
        }
      })

      // Download PDF
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `DeliveryLetter_${deliveryLetter?.membershipNo || 'export'}.pdf`
      link.click()
    } catch (err) {
      console.error('Failed to export PDF:', err)
    }
  }, [])

  return exportPDF
}

export default useExportDeliveryLetter