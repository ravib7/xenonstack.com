function openTab(evt,tabName){let i,tabcontent,multitab;for(tabcontent=document.getElementsByClassName("tabcontent"),i=0;i<tabcontent.length;i++)tabcontent[i].style.display="none";for(multitab=document.getElementsByClassName("multitab"),i=0;i<multitab.length;i++)multitab[i].className=multitab[i].className.replace(" active","");document.getElementById(tabName).style.display="block",evt.currentTarget.className+=" active"}
//# sourceURL=https://cdn2.hubspot.net/hub/8161231/hub_generated/template_assets/100916921117/1675345131140/xenonstack-hubspot-website/js/homepage-banner-tab-switch.js