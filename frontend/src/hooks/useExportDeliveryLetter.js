// src/hooks/useExportDeliveryLetter.js
import { useCallback } from 'react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const useExportDeliveryLetter = () => {
  const exportPDF = useCallback(async (deliveryLetter) => {
    try {
      const existingPdfBytes = await fetch('/templates/DeliveryLetter.pdf').then(res => res.arrayBuffer())
      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      const { _width, height } = firstPage.getSize()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const fontSize = 16

      const draw = (label, value, x, y) => {
        firstPage.drawText(`${label}: ${value || '---'}`, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        })
      }

      // Drawing starts lower on the page
      const startY = height - 300
      const lineHeight = 28
      const col1X = 50
      const col2X = 300

      const fields = [
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
        ['Sales Cert No', deliveryLetter?.carDetails?.salesCertificateNo],
        ['Sales Cert Date', deliveryLetter?.carDetails?.salesCertificateDate?.slice(0, 10)],
        ['Invoice No', deliveryLetter?.carDetails?.invoiceNo],
        ['Invoice Date', deliveryLetter?.carDetails?.invoiceDate?.slice(0, 10)],
        ['CPLC No', deliveryLetter?.carDetails?.cplcVerificationNo],
        ['CPLC Date', deliveryLetter?.carDetails?.cplcDate?.slice(0, 10)],
        
        // COLUMN 2 (right)
        ['Registered Name', deliveryLetter?.delivereeDetails?.registeredName],
        ['Deliveree Address', deliveryLetter?.delivereeDetails?.address],
        ['CNIC', deliveryLetter?.delivereeDetails?.cnic],
        ['Receiver Name', deliveryLetter?.delivereeDetails?.receiverName],
        ['Document Details', deliveryLetter?.delivereeDetails?.documentDetails],
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
      ]

      // Draw in two columns
      fields.forEach((field, index) => {
        const isLeftCol = index < Math.ceil(fields.length / 2)
        const x = isLeftCol ? col1X : col2X
        const y = startY - (lineHeight * (isLeftCol ? index : index - Math.ceil(fields.length / 2)))
        draw(field[0], field[1], x, y)
      })

      // Download the file
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
