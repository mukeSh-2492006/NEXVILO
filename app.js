const products = [
 {id:1,name:"SoundPulse Wireless Headphones",category:"Electronics",price:1499,rating:4.5,reviews:2380,quality:91,value:94,icon:"🎧",features:["40h battery","ENC mic","Bluetooth 5.3"]},
 {id:2,name:"AeroBeat Lite Earbuds",category:"Electronics",price:899,rating:4.3,reviews:4120,quality:84,value:92,icon:"🎵",features:["28h battery","Low latency","USB-C"]},
 {id:3,name:"SmartBlend Mixer 500W",category:"Home & Kitchen",price:1799,rating:4.4,reviews:1860,quality:89,value:88,icon:"🥤",features:["500W motor","3 jars","2-year warranty"]},
 {id:4,name:"HeatPro Electric Kettle",category:"Home & Kitchen",price:999,rating:4.6,reviews:3210,quality:93,value:90,icon:"🫖",features:["1.5L capacity","Auto cut-off","Steel body"]},
 {id:5,name:"PureGlow Face Cleanser",category:"Personal Care",price:349,rating:4.2,reviews:2870,quality:82,value:90,icon:"🧴",features:["Gentle formula","150ml","Daily use"]},
 {id:6,name:"FreshCare Body Wash",category:"Personal Care",price:299,rating:4.4,reviews:1980,quality:86,value:93,icon:"🫧",features:["pH balanced","250ml","Fresh fragrance"]},
 {id:7,name:"NoteCraft Premium Notebook",category:"Stationery",price:249,rating:4.7,reviews:950,quality:94,value:91,icon:"📓",features:["200 pages","80 GSM","Hard cover"]},
 {id:8,name:"WriteMax Gel Pen Set",category:"Stationery",price:149,rating:4.5,reviews:1640,quality:87,value:95,icon:"🖊️",features:["10 pens","Quick dry","0.5mm tip"]},
 {id:9,name:"Everyday Cotton T-Shirt",category:"Fashion",price:499,rating:4.1,reviews:2240,quality:81,value:89,icon:"👕",features:["Cotton blend","Regular fit","Machine wash"]},
 {id:10,name:"FlexWalk Casual Sneakers",category:"Fashion",price:1199,rating:4.5,reviews:1760,quality:88,value:87,icon:"👟",features:["Cushioned sole","Lightweight","Everyday wear"]}
];
let compareIds=[];

const money = n => "₹"+n.toLocaleString("en-IN");
function stars(r){return "★".repeat(Math.round(r))+"☆".repeat(5-Math.round(r))}
function renderProducts(){
 const cat=document.getElementById("categoryFilter").value, sort=document.getElementById("sortFilter").value;
 let list=products.filter(p=>cat==="All"||p.category===cat);
 if(sort==="value") list.sort((a,b)=>b.value-a.value);
 if(sort==="priceLow") list.sort((a,b)=>a.price-b.price);
 if(sort==="rating") list.sort((a,b)=>b.rating-a.rating);
 if(sort==="quality") list.sort((a,b)=>b.quality-a.quality);
 document.getElementById("productGrid").innerHTML=list.map(p=>`
  <article class="product-card">
   <div class="product-img"><div class="product-art">${p.icon}</div></div>
   <div class="product-info">
    <div class="product-cat">${p.category}</div><div class="product-name">${p.name}</div>
    <div class="price">${money(p.price)}</div>
    <div class="rating">${stars(p.rating)} <b>${p.rating}</b> <span>(${p.reviews.toLocaleString("en-IN")})</span></div>
    <div class="scores">
      <div class="score-box"><span>Quality Score</span><b>${p.quality}/100</b></div>
      <div class="score-box"><span>Value Score</span><b>${p.value}/100</b></div>
    </div>
    <div class="card-actions">
      <button class="compare-btn ${compareIds.includes(p.id)?"selected":""}" onclick="toggleCompare(${p.id})">${compareIds.includes(p.id)?"✓ Added":"＋ Compare"}</button>
      <button class="details-btn" onclick="showToast('${p.name.replaceAll("'","")} • ${p.features.join(" • ")}')">Details</button>
    </div>
   </div>
  </article>`).join("");
}
function toggleCompare(id){
 if(compareIds.includes(id)) compareIds=compareIds.filter(x=>x!==id);
 else if(compareIds.length<3) compareIds.push(id);
 else return showToast("You can compare up to 3 products.");
 updateBadge(); renderProducts(); renderComparison();
}
function updateBadge(){document.getElementById("compareBadge").textContent=compareIds.length}
function clearCompare(){compareIds=[];updateBadge();renderProducts();renderComparison()}
function renderComparison(){
 const area=document.getElementById("comparisonArea"), list=compareIds.map(id=>products.find(p=>p.id===id));
 if(!list.length){area.innerHTML=`<div class="comparison-empty"><div style="font-size:38px">⚖️</div><h3>No products selected yet</h3><p>Add 2–3 products from the Products section to see a side-by-side comparison.</p></div>`;return}
 if(list.length<2){area.innerHTML=`<div class="comparison-empty"><div style="font-size:38px">➕</div><h3>Add one more product</h3><p>Select at least 2 products to start comparing.</p></div>`;return}
 const best=list.reduce((a,b)=>a.value>b.value?a:b);
 const row=(label,key,fmt=v=>v)=>`<tr><th>${label}</th>${list.map(p=>`<td>${fmt(p[key])}</td>`).join("")}</tr>`;
 area.innerHTML=`<div class="comparison-wrap"><table class="comparison-table">
 <tr><th>Product</th>${list.map(p=>`<th><div class="compare-product"><div class="compare-thumb">${p.icon}</div><div><b>${p.name}</b><small style="display:block;color:#65748a">${p.category}</small></div></div></th>`).join("")}</tr>
 ${row("Price","price",money)}
 ${row("Rating","rating",v=>`${stars(v)} <b>${v}</b>`)}
 ${row("Reviews","reviews",v=>v.toLocaleString("en-IN"))}
 <tr><th>Quality Score</th>${list.map(p=>`<td><b>${p.quality}/100</b><div class="bar"><i style="width:${p.quality}%"></i></div></td>`).join("")}</tr>
 <tr><th>Value Score</th>${list.map(p=>`<td class="${p.id===best.id?"winner":""}"><b>${p.value}/100</b><div class="bar"><i style="width:${p.value}%"></i></div></td>`).join("")}</tr>
 <tr><th>Key Features</th>${list.map(p=>`<td>${p.features.map(x=>"✓ "+x).join("<br>")}</td>`).join("")}</tr>
 <tr><th>Selection</th>${list.map(p=>`<td><button class="compare-btn selected" onclick="toggleCompare(${p.id})">Remove</button></td>`).join("")}</tr>
 </table></div>
 <div class="best-box"><div style="font-size:30px">🏆</div><div><strong>Best Value: ${best.name}</strong><div>Based on the highest value score among your selected products (${best.value}/100), balancing price, quality and shopper feedback.</div></div></div>`;
}
function setCategory(cat){document.getElementById("categoryFilter").value=cat;renderProducts();document.getElementById("products").scrollIntoView({behavior:"smooth"})}
function sortBy(type){document.getElementById("categoryFilter").value="All";document.getElementById("sortFilter").value=type;renderProducts();document.getElementById("products").scrollIntoView({behavior:"smooth"})}
function searchProducts(){const q=document.getElementById("heroSearch").value.trim().toLowerCase();if(!q)return document.getElementById("products").scrollIntoView({behavior:"smooth"});const found=products.filter(p=>(p.name+" "+p.category+" "+p.features.join(" ")).toLowerCase().includes(q));document.getElementById("categoryFilter").value="All";document.getElementById("sortFilter").value="value";document.getElementById("productGrid").innerHTML=found.length?found.map(p=>`
 <article class="product-card"><div class="product-img"><div class="product-art">${p.icon}</div></div><div class="product-info"><div class="product-cat">${p.category}</div><div class="product-name">${p.name}</div><div class="price">${money(p.price)}</div><div class="rating">${stars(p.rating)} <b>${p.rating}</b> <span>(${p.reviews})</span></div><div class="scores"><div class="score-box"><span>Quality</span><b>${p.quality}/100</b></div><div class="score-box"><span>Value</span><b>${p.value}/100</b></div></div><div class="card-actions"><button class="compare-btn" onclick="toggleCompare(${p.id})">＋ Compare</button></div></div></article>`).join(""):`<div class="comparison-empty" style="grid-column:1/-1">No matching products found. Try another search.</div>`;document.getElementById("products").scrollIntoView({behavior:"smooth"})}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}
function submitContact(e){e.preventDefault();showToast("Thanks! Your feedback has been received.");e.target.reset()}
function toggleMenu(){document.getElementById("nav").classList.toggle("open")}
document.getElementById("heroSearch").addEventListener("keydown",e=>{if(e.key==="Enter")searchProducts()});
renderProducts();renderComparison();updateBadge();
