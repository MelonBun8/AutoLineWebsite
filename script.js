console.log("Yo waddup itchaboi.");

function openNewPage(pageReq) {
    switch(pageReq) {
        case 1:
            window.location.href = "index.html";
          break;
        case 2:
            window.location.href = "CatalogPage.html";
          break;
        case 3:
            window.location.href = "TouchPage.html";
        break;
        case 4:
            window.location.href = "ContactAboutPage.html";
        break;
        case 5:
            window.location.href = "LogSignPage.html";
        break;
        default:
            window.location.href = "index.html";
      }
        
    
    
}

const tabItems = document.querySelectorAll('.tab-item');
const tabContentItems = document.querySelectorAll('.tabContentItem');

//select tab content item
function selectItem(e){
    
}

//listen for tab click
tabItems.forEach( item => item.addEventListener('click', selectItem));

