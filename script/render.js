let _ = require("lodash");



class Render{
     constructor() {
         this.current = null;
         this.tmpl =  _.template('<%obj.forEach(function(item){%>\
            <li class="resultContainer_resultItem">\
                <a href="<%-item.url%>"><img class="resultItem_img" src="<%-item.img%>" alt=""></a>\
                <div class="resultItem_descriptionBox">\
                    <div class="title_box">\
                        <h4 class="descriptionBox_title"><%-item.title%></h4>\
                    </div>\
                    <h6 class="descriptionBox_name"><%-item.name%></h6>\
                    <h5 class="descriptionBox_description"><%-item.description%></h5>\
                    <h4 class="descriptionBox_date"><%-item.date%></h4>\
                    <a href="<%-item.url%>">more &rarr;</a>\
                </div>\
            </li><%});%>');
     }
       render(arr,page) {
        if(document.documentElement.clientWidth < 768) {
            if(this.current != null && this.current[0] < 768 && this.current[1] == page) {
                return;
            }
            let renderArr = arr.slice(page,page+1);
            let html = this.tmpl(renderArr);
            document.getElementById('results').innerHTML = html;
            [].forEach.call(document.getElementsByClassName('resultContainer_resultItem'),(item)=> {
                item.style.width = '90%';
            });
            this.current = [document.documentElement.clientWidth, page];
        }
        if(document.documentElement.clientWidth >= 768 && document.documentElement.clientWidth < 1024) {
            if(this.current != null && this.current[0] >= 768 && this.current[0] < 1024 && this.current[1] == page) {
                return;
            }
            let renderArr = arr.slice(page,page+3);
            let html = this.tmpl(renderArr);
            document.getElementById('results').innerHTML = html;
            [].forEach.call(document.getElementsByClassName('resultContainer_resultItem'),(item)=> {
                item.style.width = '30%';
            });
            this.current = [document.documentElement.clientWidth, page];
        }
        if(document.documentElement.clientWidth >= 1024) {
            if(this.current != null && this.current[0] >= 1024 && this.current[1] == page) {
                return;
            }
            let renderArr = arr.slice(page, page+5);
            let html = this.tmpl(renderArr);
            document.getElementById('results').innerHTML = html;
            [].forEach.call(document.getElementsByClassName('resultContainer_resultItem'),(item)=> {
                item.style.width = '18%';
            });
            this.current = [document.documentElement.clientWidth, page];
        }
       }

}



module.exports = {
    Render
}