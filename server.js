import { serve } from "https://deno.land/std@0.138.0/http/server.ts"; //公文

import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts"; //公文

let items = ['りんご', 'ぱんだ', 'けしごむ', 'まめ', 'ばなな', 'いぬ', 'ねこ', 'さかな'];
let random = Math.floor( Math.random() * items.length );
let previousWord = items[random];
let array =[]; //今までの使用した言葉入れ

console.log("Listening on http://localhost:8000"); //公文

serve(async (req) => { //公文

  const pathname = new URL(req.url).pathname; //公文


  if (req.method === "GET" && pathname === "/shiritori") {

    return new Response(previousWord);

  }

  if (req.method === "POST" && pathname === "/shiritori") {

    const requestJson = await req.json();

    const nextWord = requestJson.nextWord;
    


    if (nextWord.match(/^[ぁ-んー　]*$/) //ひらがな判定（妥協）
    ) {
    }else{
      return new Response("ひらがなのみ使用できます", { status: 400 });
    }

    if ( //しりとりが成立してるか確認

      nextWord.length > 0 &&

      previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)

    ) {

      return new Response("前の単語に続いていません。", { status: 400 });

    }


    for(let i=0; i<100; i++ //二度目の使用か確認
    ) {

      if(nextWord == array[i]
      ) {
        return new Response("同じ言葉は使用できません", { status: 400 });

      }
    }

    if(nextWord.charAt(nextWord.length -1)=='ん' //んで終った時の処理(ページ移動)
    ) {
      return new Response("んで終わったので終了です", { status: 500 });
    }

    array.push(nextWord);
    previousWord = nextWord;
    return new Response(previousWord);

  }


  return serveDir(req, { //以下公文

    fsRoot: "public",

    urlRoot: "",

    showDirListing: true,

    enableCors: true,

  });
});

