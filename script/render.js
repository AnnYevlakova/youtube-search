import _ from 'lodash';

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
        this.tooltip = null;
    }
    addElement(data) {
        let elem = document.createElement(data.tag);
        data.parent.appendChild(elem);
        if(data.length == 2) {
            return elem;
        }
        if(data.className != undefined) {
            elem.classList.add(data.className);
        }
        if(data.id != undefined) {
            elem.setAttribute('id', data.id);
        }
        if(data.type != undefined) {
            elem.setAttribute('type', data.type);
        }
        return elem;
    }
    preload() {
        let container = this.addElement({tag:'section', parent:document.getElementsByClassName('body')[0],className:'container'});
        
        let searchField = this.addElement({tag: 'section', parent:container, className:'searchField'});
        let enterQuery = this.addElement({tag:'input', parent:searchField, id:'enterQuery', type:'text'});
        enterQuery.setAttribute('placeholder', 'Are you looking for some video?');
        let searchButton = this.addElement({tag:'button', parent:searchField,id:'searchButton'});
        if(document.documentElement.clientWidth < 768) {
            searchButton.innerHTML = '&rarr;';
        } else {
            searchButton.innerHTML = 'Search';
        }
        
        let resultContainer = this.addElement({tag:'section', parent:container, className:'resultContainer'});
        let results = this.addElement({tag:'ul', parent:resultContainer, className:'resultContainer_results', id:'results'});
        
        let footer = this.addElement({tag:'footer', parent:container});
        let pagination = this.addElement({tag:'div', parent:footer, className:'pagination'});
        let prev = this.addElement({tag:'input', parent:pagination, className:'prev', id:'prev', type:'button'});
        prev.setAttribute('value', 'prev');
        let curr = this.addElement({tag:'input', parent:pagination, className:'curr', id:'curr', type:'button'});
        curr.setAttribute('value', '1');
        let next = this.addElement({tag:'input', parent:pagination, className:'next', id:'next', type:'button'});
        next.setAttribute('value', 'next');
        
        this.tooltip = this.addElement({tag:'div', parent:pagination, className:'tooltip', id:'tooltip'});
    }
    render(arr,page) {
        if(arr.length != 0) {
            document.getElementsByClassName('pagination')[0].style.display = 'block';
            
        }
        if (window.matchMedia("(max-width: 768px)").matches) {
          if(this.current != null && this.current[0] < 768 && this.current[1] == page && page != 0) {
                return;
            }
            document.getElementById('curr').value = page +1;
            document.getElementById('searchButton').innerHTML = '&rarr;';
            let renderArr = arr.slice(page,page+1);
            let html = this.tmpl(renderArr);
            document.getElementById('results').innerHTML = html;
            Array.from(document.getElementsByClassName('resultContainer_resultItem'),(item)=> {
                item.style.width = '80%';
            });
            this.current = [document.documentElement.clientWidth, page];
        } else if (window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches) {
          if(this.current != null && this.current[0] >= 768 && this.current[0] < 1024 && this.current[1] == page && page != 0) {
                return;
            }
            document.getElementById('curr').value = Math.ceil(page/3 +1);
            document.getElementById('searchButton').innerHTML = 'Search';
            let renderArr = arr.slice(page,page+3);
            let html = this.tmpl(renderArr);
            document.getElementById('results').innerHTML = html;
            Array.from(document.getElementsByClassName('resultContainer_resultItem'),(item)=> {
                item.style.width = '30%';
            });
            this.current = [document.documentElement.clientWidth, page];
        } else if (window.matchMedia("(min-width: 1024px)").matches) {
            if(this.current != null && this.current[0] >= 1024 && this.current[1] == page && page != 0) {
                return;
            }
            document.getElementById('curr').value = Math.ceil(page/5 +1);
            document.getElementById('searchButton').innerHTML = 'Search';
            let renderArr = arr.slice(page, page+5);
            let html = this.tmpl(renderArr);
            document.getElementById('results').innerHTML = html;
            Array.from(document.getElementsByClassName('resultContainer_resultItem'),(item)=> {
                item.style.width = '18%';
            });
            this.current = [document.documentElement.clientWidth, page];
        }
    }
    swipeStart(e) {
        if(e.path[0].id == 'enterQuery' || e.path[0].id == 'searchButton') {
            return;
        }
        if (e.path[0].id == 'next' || e.path[0].id == 'prev') {
            this.tooltip.style.display = 'block';
            this.tooltip.style.left = e.target.offsetLeft + e.target.offsetWidth/2 + 'px';
            if(e.target.className == 'next') {
                this.tooltip.innerHTML = +document.getElementById('curr').value + 1;
            } else if(e.target.className == 'prev') {
                this.tooltip.innerHTML = +document.getElementById('curr').value -1;
            }
            return;
        }
        if( e.path[0].classList.contains('resultItem_img')) {
            return e.path[0].parentElement.click();
        }
        if(e.path[0].tagName == 'A'){
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
        if(e.path[0].id == 'enterQuery' || e.path[0].id == 'searchButton') {
            return;
        }
        if (e.path[0].id == 'prev' || e.path[0].id == 'next') {
            this.tooltip.style.display = 'none';
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



export default Render;