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
  this.item.childNodes[3].setAttribute( "src" , this.data.src );
  this.item.childNodes[5].childNodes[1].appendChild(document.createTextNode( '作者: ' + this.data.author ));
  this.item.childNodes[5].childNodes[3].appendChild(document.createTextNode( this.data.excerpt ));
  this.item.childNodes[5].childNodes[5].appendChild(document.createTextNode( 'Like!: ' + this.data.Like ));
  this.item.childNodes[5].childNodes[5].id = "like"+this.data.id;

  this.container.appendChild(this.item);
};
GalleryItem.prototype.addClickEvent = function(){
  document.getElementById('like'+this.data.id).addEventListener('click',
    (function(that){ return function(that){

      alert('clicked: ' + that.data.id);
      Ajax({"mode":"Like","ID":that.data.id},(function(that){return function(res){
        var data = JSON.parse(res);
        console.log(that);
        that.data.Like = data.Like;
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
  this.data={
    "id": property.Product.ID,
    "title": property.Product.title,
    "sc": property.Product.imagePath,
    "author": property.Product.author,
    "excerpt": property.Product.excerpt,
    "Like": property.Product.Like,
    "description": property.Product.description,
    "comments": propaty.Comments
  };
};
Detail.prototype.writeHTML = function(){
  this.container.innerHTML += '<article class = "galleryItem">' + [
    ""+this.data.title,
    ""+this.data.sc,
    ""+this.data.author,
    ""+this.data.excerpt,
    ""+this.data.Like,
    ""+this.data.description,
    ""+this.data.Comments.join("<br>\n")
  ].join("\n") + "</article>";
};



var Page = function(container){

  this.display = function(Id){

    if(Id === undefined){//Galleryページの時
      //TODO: innerHTML="";をしておく。
      var gallery = [];

      Ajax({"mode":"ReadAll"},function(res){
          var data = JSON.parse(res);

          for(var i = 0; i < data.length; i++){
            gallery[i]= new GalleryItem(container,data[i]);
          }
          for(i = 0; i < gallery.length; i++){
            gallery[i].writeHTML();
          }

          for(i = 0; i < gallery.length; i++){
            gallery[i].addClickEvent();
          }

      });
    }

    else{//個別ページの時
      //TODO: innerHTML="";をしておく。

      Ajax({"mode":"ReadDetail"},function(res){
            var data = JSON.parse(res);

            var detail = new Detail(container,data);
            detail.writeHTML();

      });
    }
  };
};


function main(){
  var container = document.getElementById("container");

  var page = new Page(container);
  page.display();
}
