window.addEventListener("load", main);

function EncodeHTMLForm(data){
  var params = [];
  for(var name in data){
    var value = data[name];
    var param = encodeURIComponent(name).replace(/%20/g, '+') +
      '=' + encodeURIComponent(value).replace(/%20/g, '+');
    params.push(param);
  }
  return params.join('&');
}

var Ajax = function(msg,callback){
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if(this.readyState === 4 && this.status === 200){
      callback(this.responseText);
    }
    else if(this.readyState === 4 && this.status !== 200){
      console.log(this.status);
    }
  };
  xhr.open('POST', 'js/api.php');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(EncodeHTMLForm(msg));
};


var GalleryItem = function(container, property){
  this.container = container;
  this.template = document.getElementById("itemTemplate");
  this.item = undefined;
  this.data={
    "id": property.ID,
    "title": property.title,
    "sc": property.imagePath,
    "author": property.author,
    "excerpt": property.excerpt,
    "Like": property.Like
  };
};
GalleryItem.prototype.writeHTML = function(){
  this.item = this.template.cloneNode(true);
  this.item.id = 'item' + this.data.id;
  this.item.style.display = '';

  this.item.childNodes[1].appendChild(document.createTextNode( this.data.title ));
  this.item.childNodes[3].setAttribute( "src" , this.data.sc );
  this.item.childNodes[5].childNodes[1].appendChild(document.createTextNode( '作者: ' + this.data.author ));
  this.item.childNodes[5].childNodes[3].appendChild(document.createTextNode( this.data.excerpt ));
  this.item.childNodes[5].childNodes[5].appendChild(document.createTextNode( 'Like!: ' + this.data.Like ));
  this.item.childNodes[5].childNodes[5].id = "like"+this.data.id;

  this.container.appendChild(this.item);
};
GalleryItem.prototype.addLikeEvent = function(){
  document.getElementById('like'+this.data.id).addEventListener('click',
    (function(that){ return function(){

      Ajax({"mode":"Like","ID":that.data.id},(function(that){return function(res){
        var data = JSON.parse(res);
        that.data.Like = data[0].Like;
        while(that.item.childNodes[5].childNodes[5].firstChild){
          that.item.childNodes[5].childNodes[5].removeChild(that.item.childNodes[5].childNodes[5].firstChild);
        }
        that.item.childNodes[5].childNodes[5].appendChild(document.createTextNode( 'Like!: ' + that.data.Like ));
        };})(that));

    };})(this)
  );
};


var Detail = function(container, property){
  this.container = container;
  this.template = document.getElementById("detailTemplate");
  this.detail = undefined;
  this.data={
    "id": property.Product.ID,
    "title": property.Product.title,
    "sc": property.Product.imagePath,
    "author": property.Product.author,
    "excerpt": property.Product.excerpt,
    "Like": property.Product.Like,
    "description": property.Product.description,
    "comments": property.Comments,
    "dl": property.Product.DL
  };
};
Detail.prototype.writeHTML = function(){

  this.item = this.template.cloneNode(true);
  this.item.id = 'detail' + this.data.id;
  this.item.style.display = '';

  this.item.childNodes[1].appendChild(document.createTextNode( this.data.title ));
  this.item.childNodes[3].childNodes[1].setAttribute( "src" , this.data.sc );
  this.item.childNodes[5].childNodes[1].appendChild(document.createTextNode( '作者: ' + this.data.author ));
  this.item.childNodes[5].childNodes[3].childNodes[3].appendChild(document.createTextNode( this.data.description ));
  this.item.childNodes[5].childNodes[5].childNodes[1].appendChild(document.createTextNode( this.data.Like ));
  this.item.childNodes[5].childNodes[5].childNodes[3].id = "detailLike"+this.data.id;
  this.item.childNodes[5].childNodes[7].childNodes[3].setAttribute( "href" , this.data.dl );

  this.item.childNodes[9].id = "form";

  this.item.childNodes[11].id = "delete";

  while(this.item.childNodes[7].firstChild){
    this.item.childNodes[7].removeChild(this.item.childNodes[7].firstChild);
  }
  this.item.childNodes[7].appendChild(document.createElement("h1")).appendChild(document.createTextNode("コメント"));
  for(var i = 0; i < this.data.comments.length; i++){
    this.item.childNodes[7].appendChild(document.createElement("section")).appendChild(document.createTextNode(this.data.comments[i].comment));
  }
  while(this.container.firstChild){
    this.container.removeChild(this.container.firstChild);
  }

  this.container.appendChild(this.item);

};
Detail.prototype.addLikeEvent = function(){
  document.getElementById('detailLike'+this.data.id).addEventListener('click',
    (function(that){ return function(){

      Ajax({"mode":"Like","ID":that.data.id},(function(that){return function(res){

        var data = JSON.parse(res);
        that.data.Like = data[0].Like;
        while(that.item.childNodes[5].childNodes[5].childNodes[1].firstChild){
          that.item.childNodes[5].childNodes[5].childNodes[1].removeChild(that.item.childNodes[5].childNodes[5].childNodes[1].firstChild);
        }
        that.item.childNodes[5].childNodes[5].childNodes[1].appendChild(document.createTextNode( that.data.Like ));
        };})(that));

    };})(this)
  );
};
Detail.prototype.addSubmitEvent = function(){
  document.getElementById("form").submit.addEventListener('click',
    (function(that){ return function(){

      Ajax({"mode":"Submit", "ID":that.data.id, "comment": document.getElementById("form").comment.value},(function(that){return function(res){
        document.getElementById("form").comment.value = "";

        var data = JSON.parse(res);
        that.data.comments = data;
        while(that.item.childNodes[7].firstChild){
          that.item.childNodes[7].removeChild(that.item.childNodes[7].firstChild);
        }
        that.item.childNodes[7].appendChild(document.createElement("h1")).appendChild(document.createTextNode("コメント"));
        for(var i = 0; i < that.data.comments.length; i++){
          that.item.childNodes[7].appendChild(document.createElement("section")).appendChild(document.createTextNode( that.data.comments[i].comment ));
        }
        };})(that));

    };})(this)
  );
};
Detail.prototype.addDeleteEvent = function(){
  document.getElementById("delete").submit.addEventListener('click',
    (function(that){ return function(){

      Ajax({"mode":"Delete", "ID":that.data.id, "Delete": document.getElementById("delete").delete.value},(function(that){return function(res){
          console.log(res);
        };})(that));

    };})(this)
  );
};



var Page = function(container){
  var writeDetail = function(Id){
    Ajax({"mode":"ReadDetail", "ID": Id},function(res){
          var data = JSON.parse(res);
          var detail = new Detail(container,data);
          detail.writeHTML();
          detail.addLikeEvent();
          detail.addSubmitEvent();
          detail.addDeleteEvent();
    });
  };
  var writeGallery = function(){
    Ajax({"mode":"ReadAll"},function(res){
        var gallery = [];
        var data = JSON.parse(res);
        for(var i = 0; i < data.length; i++){
          gallery[i]= new GalleryItem(container, data[i]);
        }
        while(this.container.firstChild){
          this.container.removeChild(this.container.firstChild);
        }
        for(i = 0; i < gallery.length; i++){
          gallery[i].writeHTML();
        }
        for(i = 0; i < gallery.length; i++){
          gallery[i].addLikeEvent();
        }
        for(i = 0; i < gallery.length; i++){
          document.getElementById('item'+gallery[i].data.id).childNodes[1].addEventListener('click',
            (function(k){ return function(){writeDetail(k);}; })(gallery[i].data.id));
        }
    });
  };

  this.display = function(Id){
    if(Id > 0){//個別ページの時
      writeDetail(Id);
    }
    else{//Galleryページの時
      writeGallery();
    }
  };

};



function main(){
  var container = document.getElementById("container");

  var page = new Page(container);
  page.display();
  var header = document.getElementById("header");
  header.addEventListener("click",page.display);

}
