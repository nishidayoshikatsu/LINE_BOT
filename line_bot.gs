// プロパティ取得
var PROPERTIES = PropertiesService.getScriptProperties();//ファイル > プロジェクトのプロパティから設定した環境変数的なもの
//LINE・DMMの設定をプロジェクトのプロパティから取得
var LINE_ACCESS_TOKEN = PROPERTIES.getProperty('LINE_ACCESS_TOKEN');
var line_endpoint = 'https://api.line.me/v2/bot/message/reply';

//ポストで送られてくるので、ポストデータ取得
//JSONをパースする
function doPost(e) {
  var json = JSON.parse(e.postData.contents);

  //返信するためのトークン取得
  var reply_token= json.events[0].replyToken;
  var imageEndPoint = json.events[0].message.text;
  if (typeof reply_token === 'undefined') {
    return;
  }

  //送られたLINE画像を取得
  var user_message = json.events[0].message.text;
  sendLine(reply_token, imageEndPoint, user_message);
}

function sendLine(reply_token, imageEndPoint, user_message){
  imageEndPoint = "https://media.digikey.com/Photos/Assmann%20Photos/MFG_V5618A_sml.jpg";
  //返信する内容を作成
  var messages = [{
      "type": "template",
      "altText": "すまん、みつからんかったのじゃ",
      "template": {
        "type": "buttons",
        "thumbnailImageUrl": imageEndPoint,
        "title": "text回路素子みつけたぞい！！",
        "text": "頑張って調べたよ！ほめてほめて！！わあああああ",
        "actions": [
        {
        "type": "uri",
        "label": "詳細を見る",
        "uri": "https://note.mu/daikawai/n/nc393f0355579"
        }
        ]
        }
  }];

  UrlFetchApp.fetch(line_endpoint, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + LINE_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages': messages,
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}