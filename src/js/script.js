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
  xhr.open('POST', '#');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(EncodeHTMLForm(msg));
};


var GalleryItem = function(container, property){
  this.container = container;
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
  this.container.innerHTML += ['<article class="galleryItem">',
    '<h1>' + this.data.title + '</h1>',
    '<img src="' + this.data.sc + '" alt="screenshot">',
    '<section>',
      '<p>作者: ' + this.data.author + '</p>',
      '<p>' + this.data.excerpt + '</p>',
      '<div class = "like" id = like' + this.data.id + '>Like!: ' + this.data.Like +'</div>',
    '</section>',
  '</article>'].join("\n");

  document.getElementById('like'+this.data.id).addEventListener('click',
    function(){
      alert('clicked: ' + this.data.id);
    }
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