let _ = require("lodash");

class Render{
    constructor() {
         this.current = null;
         this.tmpl =  _.template('<%obj.forEach(function(item){%>\
            <li class="resultContainer_resultItem">\
                <a target="_blank" href="<%-item.url%>"><img class="resultItem_img" src="<%-item.img%>" alt=""></a>\
                <div class="resultItem_descriptionBox">\
                    <div class="title_box">\
                        <h4 class="descriptionBox_title"><%-item.title%></h4>\
                    </div>\
                    <h6 class="descriptionBox_name"><%-item.name%></h6>\
                    <h5 class="descriptionBox_description"><%-item.description%></h5>\
                    <h4 class="descriptionBox_date"><%-item.date%></h4>\
                    <a target="_blank" href="<%-item.url%>">more &rarr;</a>\
                </div>\
            </li><%});%>');
         this.detected = false;
         this.touchCoords = null;
         this.moveTo = null;
    }
    addElement(tag, parent, ...attr) {
        let elem = document.createElement(tag);
        parent.appendChild(elem);
        if(attr == undefined) {
            return elem;
        }
        if(attr[0] != null) {
            elem.classList.add(attr[0]);
        }
        if(attr[1] != null) {
            elem.setAttribute('id', attr[1]);
        }
        if(attr[2] != null) {
            elem.setAttribute('type', attr[2]);
        }
        return elem;
    }
    preload() {
        let container = this.addElement('section', document.getElementsByClassName('body')[0],'container');
        
        let searchField = this.addElement('section', container,'searchField');
        let enterQuery = this.addElement('input', searchField, null, 'enterQuery', 'text');
        enterQuery.setAttribute('placeholder', "Are you looking for some video?");
        let searchButton = this.addElement('button', searchField, null, 'searchButton')
        if(document.documentElement.clientWidth < 768) {
            searchButton.innerHTML = '&rarr;';
        } else {
            searchButton.innerHTML = 'Search';
        }
        
        let resultContainer = this.addElement('section', container, 'resultContainer');
        let results = this.addElement('ul', resultContainer, 'resultContainer_results', 'results');
        
        let footer = this.addElement('footer', container);
        let pagination = this.addElement('div', footer, 'pagination');
        let prev = this.addElement('input', pagination, 'prev', 'prev', 'button');
        prev.setAttribute('value', 'prev');
        let curr = this.addElement('input', pagination, 'curr', 'curr', 'button');
        curr.setAttribute('value', '1');
        let next = this.addElement('input', pagination, 'next', 'next', 'button');
        next.setAttribute('value', 'prev');
    }
    render(arr,page) {
        if(arr.length != 0) {
            document.getElementsByClassName('pagination')[0].style.display = 'block';
            
        }
        if(document.documentElement.clientWidth < 768) {
            if(this.current != null && this.current[0] < 768 && this.current[1] == page && page != 0) {
                return;
            }
            document.getElementById('curr').value = page +1;
            document.getElementById("searchButton").innerHTML = '&rarr;';
            let renderArr = arr.slice(page,page+1);
            let html = this.tmpl(renderArr);
            document.getElementById('results').innerHTML = html;
            [].forEach.call(document.getElementsByClassName('resultContainer_resultItem'),(item)=> {
                item.style.width = '80%';
            });
            this.current = [document.documentElement.clientWidth, page];
        }
        if(document.documentElement.clientWidth >= 768 && document.documentElement.clientWidth < 1024) {
            if(this.current != null && this.current[0] >= 768 && this.current[0] < 1024 && this.current[1] == page && page != 0) {
                return;
            }
            document.getElementById('curr').value = Math.ceil(page/3 +1);
            document.getElementById("searchButton").innerHTML = 'Search';
            let renderArr = arr.slice(page,page+3);
            let html = this.tmpl(renderArr);
            document.getElementById('results').innerHTML = html;
            [].forEach.call(document.getElementsByClassName('resultContainer_resultItem'),(item)=> {
                item.style.width = '30%';
            });
            this.current = [document.documentElement.clientWidth, page];
        }
        if(document.documentElement.clientWidth >= 1024) {
            if(this.current != null && this.current[0] >= 1024 && this.current[1] == page && page != 0) {
                return;
            }
            document.getElementById('curr').value = Math.ceil(page/5 +1);
            document.getElementById("searchButton").innerHTML = 'Search';
            let renderArr = arr.slice(page, page+5);
            let html = this.tmpl(renderArr);
            document.getElementById('results').innerHTML = html;
            [].forEach.call(document.getElementsByClassName('resultContainer_resultItem'),(item)=> {
                item.style.width = '18%';
            });
            this.current = [document.documentElement.clientWidth, page];
        }
    }
    swipeStart(e) {
        if(e.path[0].id == 'enterQuery' || e.path[0].id == 'searchButton' || e.path[0].id == 'prev') {
            return;
        }
        if( e.path[0].classList.contains("resultItem_img")) {
            return e.path[0].parentElement.click();;
        }
        if(e.path[0].tagName == "A"){
            return e.path[0].click();
        }
            
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else { 
            document.selection.empty();
        }
        if (this.detected){
            return;
        }
        this.detected = true;
        if(e.type == 'touchstart') {
            this.touchCoords = [e.targetTouches[0].pageX, e.targetTouches[0].pageY];
        } else {
            this.touchCoords = [e.pageX, e.pageY];
        }
    }
    swipeEnd(e) {
        if(e.path[0].id == 'enterQuery' || e.path[0].id == 'searchButton' || e.path[0].id == 'prev' || e.path[0].id == 'next') {
            return;
        }
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else { 
            document.selection.empty();
        }
        let coords;
        let newCoords;
        if(e.type == 'touchend') {
            coords = this.touchCoords;
            newCoords = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
            e.preventDefault();
            this.detect(coords, newCoords);
        } else if (e.type == 'mouseup'){
            if (!this.detected){
                return;
            } else {
                coords = this.touchCoords;
                newCoords = [e.pageX, e.pageY];
                e.preventDefault();
                this.detect(coords, newCoords);
            }
        }
    }
    detect(coords, newCoords){
        if (Math.abs(coords[0] -  newCoords[0]) >= Math.abs(coords[1] - newCoords[1]) && coords[0] -  newCoords[0] > 0){
            document.getElementById('next').click();

        } else if (Math.abs(coords[0] -  newCoords[0]) >= Math.abs(coords[1] - newCoords[1]) && coords[0] -  newCoords[0] < 0) {
            document.getElementById('prev').click();
        }
        this.detected = false;
    }
}



module.exports = {
    Render
}