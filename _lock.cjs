const fs=require("fs"),path=require("path"),{Resvg}=require("@resvg/resvg-js");
const pub=path.join(__dirname,"public");
const svg=fs.readFileSync(path.join(pub,"logo.svg"),"utf8");
const fdir=path.join(__dirname,"node_modules/@fontsource/fraunces/files");
const fontFiles=["fraunces-latin-600-normal.woff2"].map(f=>path.join(fdir,f)).filter(fs.existsSync);
console.log("font files:",fontFiles);
try{
  const r=new Resvg(svg,{fitTo:{mode:"width",value:936},font:{fontFiles,loadSystemFonts:true,defaultFontFamily:"Fraunces"}});
  fs.writeFileSync(path.join(pub,"logo-lockup-test.png"),r.render().asPng());
  console.log("rendered logo-lockup-test.png");
}catch(e){console.log("ERR",e.message);}
