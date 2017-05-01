let {Render} = require('./render');

class Youtube extends Render{
    constructor(key) {
        super();
        this.key = key;
        this.query = '';
        this.items = [];
        this.prev = {
            prev: null,
            this: null,
            page: 0,
            items: []
        };
        this.curr = {
            this: null,
            page: 1,
            items: []
        };
        this.next = {
            this: null,
            next: null,
            page: 0,
            items: []
        };
        this.page = 0;
    }
    init() {
        gapi.auth.authorize({
            client_id: '1023823723398-qa1vdrede2jf9mr6657hshaibfb6mn94.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/youtube.readonly',
            immediate: false
        }, function() {});
        gapi.client.setApiKey(this.key);
        gapi.client.load("youtube", "v3", function(){});
    }
    setListeners() {
        let self = this;
        document.getElementById('next').addEventListener('click', function() {self.search(0, self.next.next, self)});
        document.getElementById('prev').addEventListener('click', function() {self.search(self.prev.prev, 0, self)});
        document.getElementById('searchButton').addEventListener('click', function() {self.search(0,0, self)});
        window.addEventListener('resize', function(){self.render(self.items, self.page);});
    }
    search(prev, next, self) {
        let results;
        let request;
        self.query = document.getElementById('enterQuery').value;
        
        if(prev == 0 & next == 0) {
            self.prev.prev = null;
            self.prev.this = null;
            self.prev.page = 0,
            self.prev.items = [];
            gapi.client.youtube.search.list({
                    part: "snippet",
                    type: "video",
                    q: self.query,
                    order: "viewCount"
            }).then(function(request) {
                results = request.result;
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
                    self.next.this = results.nextPageToken;
                    self.next.page = 2;
                    return gapi.client.youtube.search.list({
                        part: "snippet",
                        type: "video",
                        q: self.query,
                        order: "viewCount",
                        pageToken: self.next.this
                    });
                }
            }).then(function(request){
                results = request.result;
                self.next.items = self.setItems(results);
                self.items = [...self.items, ...self.next.items];
                self.curr.this = results.prevPageToken;
                self.next.next = results.nextPageToken;
            });
        }
        if(prev != 0 ) {
            if(self.page == 0) {
                return;
            }
            
            if(document.documentElement.clientWidth < 768) { 
                self.page -= 1;
                self.render(self.items, self.page);
            } else if(document.documentElement.clientWidth >= 768 && document.documentElement.clientWidth < 1024){
                self.page -= 3;
                self.render(self.items, Math.floor(self.page));
            } else if(document.documentElement.clientWidth >= 1024){
                self.page -= 5;
                self.render(self.items, Math.floor(self.page));
            }
            /*self.next.items = self.curr.items;
            self.next.next = self.next.this;
            self.next.this = self.curr.this;
            self.curr.page -= 1;             
            self.curr.items = self.prev.items;
            render(self.curr.items);
            self.curr.this = self.prev.this;
            gapi.client.youtube.search.list({
                    part: "snippet",
                    type: "video",
                    q: self.query,
                    order: "viewCount",
                    pageToken: prev
            }).then(function(request) {
                results = request.result;
                self.prev.items = self.setItems(results);
                self.prev.this = self.prev.prev;
                if(results.prevPageToken != undefined) {
                    self.prev.prev = results.prevPageToken;
                } else {
                    self.prev.prev = null;
                }
                self.prev.page = self.curr.page-1;
            });*/
        }
        if(next != 0 ) {
            if(self.next.next == null) {
                return;
            }
            
            if(self.items[self.page+self.page*5+1] == undefined && self.next.next != null) {
                gapi.client.youtube.search.list({
                    part: "snippet",
                    type: "video",
                    q: self.query,
                    order: "viewCount",
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
                });
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
            /*self.prev.items = self.curr.items;
            self.prev.prev= self.prev.this;
            self.prev.this = self.curr.this;
            self.curr.page += 1;             
            self.curr.items = self.next.items;
            render(self.curr.items);
            self.curr.this = self.next.this;
            gapi.client.youtube.search.list({
                    part: "snippet",
                    type: "video",
                    q: self.query,
                    order: "viewCount",
                    pageToken: next
            }).then(function(request) {
                results = request.result;
                self.next.this = self.next.next;
                self.next.items = self.setItems(results);
                if(results.nextPageToken != undefined) {
                    self.next.next = results.nextPageToken;
                } else {
                    self.next.next = null;
                }
                self.next.page = self.curr.page+1;
            });*/
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
            }
        });
        return items;
    }
}

/*class GreatPerson extends Person {
  constructor(name, phrase) {
    super(name);
    this.phrase = phrase;
  }
  sayPhrase() {
    console.log(`${this.name} says: "${this.phrase}"`)
  }
}*/




module.exports = {
    Youtube
}





