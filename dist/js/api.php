<?php
$dbname = "sqlite:Datebase.db";
$m = param("mode");


switch($m){
  case "Register": method_Register(); break;
  case "Like": method_CountGood();break;
  case "Write": method_Write();break;
  case "ReadAll":method_ReadAll();break;
  case "ReadDetail":method_ReadDetail();break;
  case "ReadComment";method_ReadComment();break;
  case "Submit":method_Submit();break;
  default :errorJSON("no method"); break;
}


function outputJSON($params){
  $params["stat"] = "ok";
  echo json_encode($params);
}


function errorJSON($reason){
echo json_encode(["stat" => "ng",
"reaon"=>$reason]);
exit;
}



function method_CountGood(){
  $pdo = GetDB();
  $id = param("ID");

  $stmt = $pdo->Prepare("update Production set GoodCount = GoodCount + 1
  where ID = ?");
  $stmt ->execute(array($id));

  $stmt = $pdo->Prepare("select GoodCount from Production where ID = ?");
  $stmt->execute(array($id));
  $a = $stmt->fetchAll();

  $goodCount = array();
  foreach($a as $r){
    $goodCount [] = array("Like"=>$r["GoodCount"]);

  }
  echo json_encode($goodCount);


}


function method_Write(){
  echo "write";
}


function method_ReadComment(){
  $pdo = GetDB();
  $id = param("ID");
  $stmt = $pdo ->Preapre("select Comment from Comment where prod_id = ?");
  $stmt->execute(array($id));
  $a = $stmt->fetchAll();

$comments = array();
foreach($a as $r){
  $comments[] = ["comment" =>$r["Comment"]];

}
json_encode($comments);

}


function method_ReadAll(){
  $pdo = GetDB();

  $stmt = $pdo->Prepare("select * from Production");
  $stmt->execute();
  $a = $stmt->fetchAll();

  $res = array();
  foreach($a as $row){

  $res[] = array("ID"=>htmlentities($row["ID"]),
                  "title"=>htmlentities($row["Name"]),
                  "Like"=>htmlentities($row["GoodCount"]),
                  "excerpt"=>htmlentities($row["Summ"]),
                  "author"=>htmlentities($row["Author"]),
                  "imagePath"=>htmlentities($row["ImagePath"]));
                }

echo json_encode($res);

}

function method_ReadDetail(){

  $pdo = GetDB();
  $id = param("ID");
  $stm = $pdo->Prepare("select * from Production where ID = ?");
  $stm->execute(array($id));
  $a = $stm->fetchAll();
  $Product = array();
  foreach($a as $r){
    $Product =["ID"=>htmlentities($id),"title"=>htmlentities($r["Name"]),
                      "Like"=>htmlentities($r["GoodCount"]),
                      "imagePath"=>htmlentities($r["ImagePath"]),
                      "description"=>htmlentities($r["Detail"]),
                      "excerpt"=>htmlentities($r["Summ"]),
                      "author"=>htmlentities($r["Author"])];
  }

  $stmtc = $pdo->Prepare("select Comment from Comments where prod_id == ?");
  $stmtc -> execute(array($id));
  $ac = $stmtc->fetchAll();
  $comments = array();
  foreach($ac as $row ){
    $comments[] = array("comment"=>htmlentities($row["Comment"]));

  }
  echo json_encode(["Product"=>$Product,"Comments"=>$comments]);

}

function method_Register(){
  $pdo = GetDB();
  $sql = "select Count(*) from Production";
  $res = $pdo->query($sql);
  $id = $res->fetchColumn() +1;



  $stmt = $pdo->Prepare("insert into Production
  (Name,GoodCount,ImagePath,Detail,Summ,Author) values (?,0,?,?,?,?)");
  $name = param("title","null");

  $imageName = UploadImage($id) != null ? UploadImage($id) : "Null";
  echo "test1";
  $programPath = UploadProduct() != null ? UploadProduct() : "Null";

  $Detail = param("description","null");
  $Summ = param("excerpt","null");
  $Author = param("author","null");
  try {
    $stmt->execute(Array($name,$imageName,$Detail,$Summ,$Author));
  } catch(PDOException $e)
  {
    eroorJSON("DB書き込み失敗");
  }
  outputJSON(["msg" =>"書き込みました"]);
}

function method_Submit(){
  $pdo = GetDB();
  $comment = param("comment");
  $id = param("ID");

  $stmt = $pdo -> Prepare("insert into Comments (prod_id,cemment) values (?,?)");
  try{
    $stmt->execute(array($id,$comment));
  }catch(PDOException $e ){
    errorJSON("DB書き込み失敗");

  }

  method_ReadComment();




}


function GetDB(){
  Global $dbname;
 $pdo;
  if(isset($pdo)) return $pdo;

  $pdo = new PDO($dbname);
  $pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
  return $pdo;




}

function UploadProduct(){

echo "test";
  if(isset($_FILES["program"]["error"])&&is_int($_FILES["program"]["error"])){
    try{
      switch ($_FILES["program"]["error"]){
        case UPLOAD_ERR_OK: break;
        case UPLOAD_ERR_NO_FILE: throw new RuntimeException("ファイルが選択されてません");
        case UPLOAD_ERR_INI_SIZE: throw new RuntimeException("ファイルサイズが大きすぎます");
        default: throw new RuntimeException("その他のエラー");

        }

        $id = param("id","0");
        $path = "program/".$id.$_FILES["program"]["name"];

        if(!move_uploaded_file($_FILES["program"]["tmp_name"],$path)){
          throw new RuntimeException("アップロードに失敗しました");
        }


          echo $path;
          return $path;

      }catch(RuntimeException $e){
        echo $e->getMessage();
        errorJSON($e->getMessage());
      }
  }
}

function UploadImage($id){
echo "<br>";

  if(isset($_FILES["screenshot"]["error"])&&is_int($_FILES["screenshot"]["error"])){
    try{
      switch ($_FILES["screenshot"]["error"]){
        case UPLOAD_ERR_OK: break;
        case UPLOAD_ERR_NO_FILE: throw new RuntimeException("ファイルが選択されてません");
        case UPLOAD_ERR_INI_SIZE: throw new RuntimeException("ファイルサイズが大きすぎます");
        default: throw new RuntimeException("その他のエラー");

      }
      $type = @exif_imagetype($_FILES["screenshot"]["tmp_name"]);
      echo $type;
      /*if(!in_array($type,[IMAGETYPE_GIF,IMAGETYPE_JPEG,IMAGETYPE_PNG],true)){
        throw new RuntimeException("対応してない画像形式です");
      }*/



      $path = $_FILES["screenshot"]["name"];

      $paths = "img/img".$id.$path;


      move_uploaded_file($_FILES["screenshot"]["tmp_name"],$paths);
    //  if(!move_uploaded_file($_FILES["screenshot"]["tmp_name"],$paths)){
      //  throw new RuntimeException("ファイル保存でエラーが生じました");
    //  }
      chmod($paths,0644);
      echo $paths;
      echo "<br>";
      return $paths;



    }catch(RuntimeException $e){
      echo $e->getMessage();
      errorJSON($e->getMessage());
      return null;
    }
  }
}



function param($name,$def = ""){
  if(!isset($_POST[$name])) return $def;
  return $_POST[$name];
}
?>
