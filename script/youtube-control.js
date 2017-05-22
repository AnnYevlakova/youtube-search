import Render from './render';

class Youtube extends Render{
    constructor(key) {
        super();
        this.key = key;
        this.query = '';
        this.items = [];
        this.prev = {
            prev: null,
            items: []
        };
        this.curr = {
            items: []
        };
        this.next = {
            next: null,
            items: []
        };
        this.page = 0;
    }
    init() {
        /*gapi.auth.authorize({
            client_id: '1023823723398-qa1vdrede2jf9mr6657hshaibfb6mn94.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/youtube.readonly',
            immediate: false
        }, function() {});*/
        gapi.client.setApiKey(this.key);
        gapi.client.load('youtube', 'v3', function(){});
    }
    setListeners() {
        document.getElementById('next').addEventListener('click', () => {this.search(0, this.next.next, this);}); 
        document.getElementById('prev').addEventListener('click', () => {this.search(this.prev.prev, 0, this);}); 
        document.getElementById('searchButton').addEventListener('click', () => {this.search(0,0, this);});
        window.addEventListener('resize', () =>{this.render(this.items, this.page);});
        window.addEventListener('touchstart', (e) =>{this.swipeStart(e);});
        window.addEventListener('mousedown', (e) =>{this.swipeStart(e);});
        window.addEventListener('touchend', (e) =>{this.swipeEnd(e);});
        window.addEventListener('mouseup', (e) =>{this.swipeEnd(e);});
        window.addEventListener('keydown', (e) =>{
            if(e.keyCode == 13) {
                document.getElementById('searchButton').click();
            }
        });
        document.getElementById('enterQuery').addEventListener('focus', function(){
            this.setAttribute('placeholder','. . .');
            this.value = '';
        });
        document.getElementById('enterQuery').addEventListener('blur', function(){
            this.setAttribute('placeholder','Are you looking for some video?');
        });
    }
    search(prev, next, self) {
        let results;
        self.query = document.getElementById('enterQuery').value;
        
        if(prev == 0 & next == 0) {
            self.prev.prev = null;
            self.prev.items = [];
            self.items = [];
            self.page = 0;
            gapi.client.youtube.search.list({
                part: 'snippet',
                type: 'video',
                q: self.query,
                order: 'viewCount'
            }).then(function(request) {
                results = request.result;
                if(request.items.length == 0) {
                    return;
                }
                self.curr.items = self.setItems(results);
                self.items = [...self.items, ...self.curr.items];
                if(document.documentElement.clientWidth < 768) { 
                    self.render(self.items, self.page);
                } else if(document.documentElement.clientWidth >= 768 && document.documentElement.clientWidth < 1024){
                    self.render(self.items, Math.floor(self.page));
                } else if(document.documentElement.clientWidth >= 1024){
                    self.render(self.items, Math.floor(self.page));
                }
                if(results.nextPageToken != undefined) {
                    self.next.next = results.nextPageToken;
                    return gapi.client.youtube.search.list({
                        part: 'snippet',
                        type: 'video',
                        q: self.query,
                        order: 'viewCount',
                        pageToken: self.next.next
                    });
                }
            }).then(function(request){
                results = request.result;
                self.next.items = self.setItems(results);
                self.items = [...self.items, ...self.next.items];
                self.next.next = results.nextPageToken;
            });
        }
        if(prev != 0 ) {
            if(self.page <= 0) {
                self.page = 0;
                return;
            }
            if(document.documentElement.clientWidth < 768) { 
                self.page -= 1;
                self.render(self.items, self.page);
            } else if(document.documentElement.clientWidth >= 768 && document.documentElement.clientWidth < 1024){
                self.page -= 3;
                if(self.page <= 0) {
                    self.page = 0;
                }
                self.render(self.items, Math.floor(self.page));
            } else if(document.documentElement.clientWidth >= 1024){
                self.page -= 5;
                if(self.page <= 0) {
                    self.page = 0;
                }
                self.render(self.items, Math.floor(self.page));
            }
        }
        if(next != 0 ) {
            if(self.next.next == null) {
                return;
            }
            if(self.items[self.page+self.page*5+1] == undefined && self.next.next != null) {
                gapi.client.youtube.search.list({
                    part: 'snippet',
                    type: 'video',
                    q: self.query,
                    order: 'viewCount',
                    pageToken: next
                }).then(function(request) {
                    results = request.result;
                    self.next.items = self.setItems(results);
                    self.items = [...self.items, ...self.next.items];
                    if(results.nextPageToken != undefined) {
                        self.next.next = results.nextPageToken;
                    } else {
                        self.next.next = null;
                    }
                    if(document.documentElement.clientWidth < 768) { 
                        self.page += 1;
                        self.render(self.items, self.page);
                    } else if (document.documentElement.clientWidth >= 768 && document.documentElement.clientWidth < 1024){
                        self.page += 3;
                        self.render(self.items, Math.floor(self.page));
                    } else if (document.documentElement.clientWidth >= 1024){
                        self.page += 5;
                        self.render(self.items, Math.floor(self.page));
                    }
                });
            } else {
                if(document.documentElement.clientWidth < 768) { 
                    self.page += 1;
                    self.render(self.items, self.page);
                } else if (document.documentElement.clientWidth >= 768 && document.documentElement.clientWidth < 1024){
                    self.page += 3;
                    self.render(self.items, Math.floor(self.page));
                } else if (document.documentElement.clientWidth >= 1024){
                    self.page += 5;
                    self.render(self.items, Math.floor(self.page));
                }
            }
        }
    }
    setItems(results) {
        let items = results.items.map((item)=> {
            return {
                img: item.snippet.thumbnails.high.url,
                title: item.snippet.title,
                name: item.snippet.channelTitle,
                description: item.snippet.description,
                date: item.snippet.publishedAt.slice(0,10),
                url: 'https://www.youtube.com/watch?v='+item.id.videoId
            };
        });
        return items;
    }
}

export default Youtube;