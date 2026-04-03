const React = require(`react`);
const { useState } = React;
const RN = require(`react-native`);
const { View, Text, ScrollView, TouchableOpacity, TextInput,
StatusBar, SafeAreaView, StyleSheet, Modal } = RN;

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
bg:`#060D09`, bgSurface:`#0C1810`, bgOverlay:`#172A1A`,
gold:`#C9A84C`, goldLight:`#DFC06A`, goldDim:`#8A6F2E`,
goldFaint:`rgba(201,168,76,0.12)`,
greenBright:`#3D8B50`, greenMid:`#2A5C35`,
textPrimary:`#F0EBE0`, textSecondary:`#A89880`, textMuted:`#5C5245`, textInverse:`#060D09`,
birdie:`#3D8B50`, par:`#F0EBE0`, bogey:`#C9724C`, double:`#A84C3A`, eagle:`#DFC06A`,
borderGold:`rgba(201,168,76,0.22)`, borderGreen:`rgba(42,92,53,0.5)`, borderSub:`rgba(240,235,224,0.07)`,
};
const FONT = `Georgia`;
const EMPTY = [].join();

// ── Club data ─────────────────────────────────────────────────────────────────
const CLUBS = [
{id:`driver`,name:`Driver`,       cat:`woods`, icon:`▲`,defaultDist:260,removable:false},
{id:`3w`,    name:`3 Wood`,       cat:`woods`, icon:`▲`,defaultDist:230,removable:true},
{id:`5w`,    name:`5 Wood`,       cat:`woods`, icon:`▲`,defaultDist:215,removable:true},
{id:`3h`,    name:`3 Hybrid`,     cat:`hybrid`,icon:`◆`,defaultDist:205,removable:true},
{id:`4i`,    name:`4 Iron`,       cat:`iron`,  icon:`—`,defaultDist:195,removable:true},
{id:`5i`,    name:`5 Iron`,       cat:`iron`,  icon:`—`,defaultDist:183,removable:true},
{id:`6i`,    name:`6 Iron`,       cat:`iron`,  icon:`—`,defaultDist:170,removable:true},
{id:`7i`,    name:`7 Iron`,       cat:`iron`,  icon:`—`,defaultDist:157,removable:false},
{id:`8i`,    name:`8 Iron`,       cat:`iron`,  icon:`—`,defaultDist:144,removable:true},
{id:`9i`,    name:`9 Iron`,       cat:`iron`,  icon:`—`,defaultDist:132,removable:true},
{id:`pw`,    name:`PW`,           cat:`iron`,  icon:`—`,defaultDist:120,removable:true},
{id:`gw`,    name:`Gap Wedge`,    cat:`wedge`, icon:`◐`,defaultDist:108,removable:true,loft:50},
{id:`sw`,    name:`Sand Wedge`,   cat:`wedge`, icon:`◐`,defaultDist:90, removable:true,loft:54},
{id:`lw`,    name:`Lob Wedge`,    cat:`wedge`, icon:`◐`,defaultDist:72, removable:true,loft:60},
{id:`pt`,    name:`Putter`,       cat:`putter`,icon:`●`,defaultDist:0,  removable:false},
];

const COURSE_DB = [
{id:1, name:`Bethpage Black`,         city:`Farmingdale, NY`, rating:76.6,slope:155,par:71},
{id:2, name:`Pebble Beach Golf Links`,city:`Pebble Beach, CA`,rating:74.7,slope:145,par:72},
{id:3, name:`Rockaway River CC`,      city:`Denville, NJ`,    rating:71.2,slope:122,par:71},
{id:4, name:`Berkshire Valley Golf`,  city:`Oak Ridge, NJ`,   rating:73.4,slope:131,par:72},
{id:5, name:`Ballyowen Golf Club`,    city:`Hamburg, NJ`,     rating:74.3,slope:138,par:72},
{id:6, name:`Hominy Hill GC`,         city:`Colts Neck, NJ`,  rating:73.9,slope:133,par:72},
{id:7, name:`Flanders Valley`,        city:`Flanders, NJ`,    rating:72.1,slope:126,par:72},
{id:8, name:`Architects Golf Club`,   city:`Lopatcong, NJ`,   rating:74.1,slope:136,par:72},
{id:9, name:`Twisted Dune GC`,        city:`Egg Harbor, NJ`,  rating:74.1,slope:136,par:72},
{id:10,name:`Winged Foot (West)`,      city:`Mamaroneck, NY`,  rating:75.8,slope:143,par:72},
];

// ── WHS ───────────────────────────────────────────────────────────────────────
const calcHandicapIndex = (rounds) => {
if (!rounds || rounds.length < 3) return null;
const diffs = rounds.slice(0).sort((a,b) => a.differential - b.differential);
const n = rounds.length<=6?1:rounds.length<=9?2:rounds.length<=11?3:
rounds.length<=13?4:rounds.length<=15?5:rounds.length<=16?6:
rounds.length<=17?7:rounds.length<=18?8:rounds.length<=19?9:10;
const best = diffs.slice(0,n);
return parseFloat((best.reduce((a,b)=>a+b.differential,0)/n*0.96).toFixed(1));
};

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
label:     {fontSize:9,fontFamily:FONT,color:C.textMuted,letterSpacing:1.4,fontWeight:`600`},
card:      {backgroundColor:C.bgSurface,borderRadius:12,borderWidth:1,borderColor:C.borderGreen,padding:14,marginBottom:10},
gCard:     {backgroundColor:C.bgSurface,borderRadius:12,borderWidth:1,borderColor:C.borderGold,padding:14,marginBottom:10},
goldBtn:   {backgroundColor:C.gold,borderRadius:12,padding:14,alignItems:`center`},
goldBtnTx: {color:C.textInverse,fontFamily:FONT,fontWeight:`700`,fontSize:14},
ghostBtn:  {borderRadius:12,borderWidth:1,borderColor:C.borderGreen,padding:14,alignItems:`center`},
ghostBtnTx:{color:C.textSecondary,fontFamily:FONT,fontSize:13},
input:     {backgroundColor:C.bgOverlay,borderWidth:1,borderColor:C.borderGreen,borderRadius:10,padding:12,fontSize:15,color:C.textPrimary,fontFamily:FONT},
});

const clubColor = (cat) => ({woods:C.gold,hybrid:C.goldLight,iron:C.greenBright,wedge:C.textSecondary,putter:C.textMuted}[cat]||C.textSecondary);
const clubLabel = (c) => c.cat===`wedge`&&c.loft?`${c.loft}° Wedge`:c.name;

// ── Shared ClubRow ────────────────────────────────────────────────────────────
function ClubRow({c, onRemove, onActivate, onDist, showVault}) {
return (
<View style={{flexDirection:`row`,alignItems:`center`,backgroundColor:C.bgSurface,borderWidth:1,borderColor:showVault?C.borderSub:C.borderGreen,borderRadius:10,marginBottom:5,overflow:`hidden`,opacity:showVault?0.7:1}}>
<View style={{flex:1,flexDirection:`row`,alignItems:`center`,padding:12,gap:10}}>
<Text style={{fontSize:11,color:clubColor(c.cat),width:14,textAlign:`center`}}>{c.icon}</Text>
<View style={{flex:1}}>
<Text style={{fontSize:14,color:C.textPrimary,fontFamily:FONT}}>{clubLabel(c)}</Text>
{(c.make||c.model)?<Text style={{fontSize:10,color:C.textMuted,fontFamily:FONT}}>{[c.make,c.model].filter(Boolean).join(` `)}</Text>:null}
</View>
{c.cat!==`putter`&&(
<View style={{flexDirection:`row`,alignItems:`center`,gap:6}}>
{onDist&&<TouchableOpacity onPress={()=>onDist(Math.max(0,c.dist-5))} style={{width:28,height:28,borderRadius:6,borderWidth:1,borderColor:C.borderSub,backgroundColor:C.bgOverlay,alignItems:`center`,justifyContent:`center`}}>
<Text style={{color:C.textSecondary,fontSize:14}}>−</Text>
</TouchableOpacity>}
<Text style={{fontSize:16,fontWeight:`700`,color:clubColor(c.cat),minWidth:36,textAlign:`center`,fontFamily:FONT}}>{c.dist}</Text>
{onDist&&<TouchableOpacity onPress={()=>onDist(c.dist+5)} style={{width:28,height:28,borderRadius:6,borderWidth:1,borderColor:C.borderSub,backgroundColor:C.bgOverlay,alignItems:`center`,justifyContent:`center`}}>
<Text style={{color:C.textSecondary,fontSize:14}}>+</Text>
</TouchableOpacity>}
</View>
)}
</View>
{onRemove&&<TouchableOpacity onPress={onRemove} style={{paddingHorizontal:14,alignSelf:`stretch`,justifyContent:`center`,borderLeftWidth:1,borderLeftColor:C.borderSub}}>
<Text style={{color:C.textMuted,fontSize:14}}>✕</Text>
</TouchableOpacity>}
{onActivate&&<TouchableOpacity onPress={onActivate} style={{paddingHorizontal:14,alignSelf:`stretch`,justifyContent:`center`,borderLeftWidth:1,borderLeftColor:C.borderSub}}>
<Text style={{color:C.gold,fontSize:11,fontFamily:FONT}}>+ Add</Text>
</TouchableOpacity>}
</View>
);
}

// ── Add Club Modal ────────────────────────────────────────────────────────────
function AddClubModal({visible, onClose, onAdd, existingClubs}) {
const [tab, setTab]             = useState(`preset`);
const [customName, setCustomName] = useState(null);
const [customCat,  setCustomCat]  = useState(`iron`);
const [customDist, setCustomDist] = useState(`150`);
const [customLoft, setCustomLoft] = useState(null);

const existingIds = new Set(existingClubs.map(c=>c.id));
const presets = CLUBS.filter(c=>!existingIds.has(c.id));
const vaulted = existingClubs.filter(c=>!c.inBag);
const CATS    = [`woods`,`hybrid`,`iron`,`wedge`,`putter`];
const catIcons= {woods:`▲`,hybrid:`◆`,iron:`—`,wedge:`◐`,putter:`●`};

const addCustom = () => {
if (!customName.trim()||!customDist) return;
onAdd({id:`custom_`+Date.now(),name:customName.trim(),cat:customCat,icon:catIcons[customCat]||`—`,
dist:parseInt(customDist)||150,defaultDist:parseInt(customDist)||150,
loft:customLoft?parseInt(customLoft):null,make:EMPTY,model:EMPTY,inBag:true,removable:true});
setCustomName(EMPTY);setCustomDist(`150`);setCustomLoft(EMPTY);
onClose();
};

return (
<Modal visible={visible} animationType=`slide` presentationStyle=`pageSheet` onRequestClose={onClose}>
<SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
<View style={{flexDirection:`row`,justifyContent:`space-between`,alignItems:`center`,padding:18,borderBottomWidth:1,borderBottomColor:C.borderGold}}>
<Text style={{fontSize:16,fontWeight:`700`,color:C.textPrimary,fontFamily:FONT}}>Add Club</Text>
<TouchableOpacity onPress={onClose}><Text style={{fontSize:18,color:C.textMuted}}>✕</Text></TouchableOpacity>
</View>
<View style={{flexDirection:`row`,padding:12,gap:8}}>
{[{v:`preset`,l:`Standard`},{v:`vault`,l:`Vault`},{v:`custom`,l:`Custom`}].map(t=>(
<TouchableOpacity key={t.v} onPress={()=>setTab(t.v)}
style={{flex:1,padding:9,borderRadius:9,borderWidth:1,borderColor:tab===t.v?C.borderGold:C.borderSub,backgroundColor:tab===t.v?C.goldFaint:`transparent`,alignItems:`center`}}>
<Text style={{fontSize:11,fontFamily:FONT,color:tab===t.v?C.gold:C.textMuted,fontWeight:tab===t.v?`700`:`400`}}>{t.l}</Text>
</TouchableOpacity>
))}
</View>
<ScrollView contentContainerStyle={{padding:16}} keyboardShouldPersistTaps=`handled`>
{tab===`preset`&&(
presets.length===0
?<Text style={{color:C.textMuted,fontFamily:FONT,textAlign:`center`,marginTop:24}}>All standard clubs already in bag.</Text>
:presets.map(c=>(
<TouchableOpacity key={c.id} onPress={()=>{onAdd(Object.assign({},c,{dist:c.defaultDist,inBag:true,make:EMPTY,model:EMPTY}));onClose();}}
style={{flexDirection:`row`,justifyContent:`space-between`,alignItems:`center`,padding:13,backgroundColor:C.bgSurface,borderRadius:10,borderWidth:1,borderColor:C.borderGreen,marginBottom:6}}>
<Text style={{fontSize:13,color:C.textPrimary,fontFamily:FONT}}>{c.name}</Text>
<Text style={{fontSize:11,color:C.gold,fontFamily:FONT}}>{c.defaultDist}y  + Add</Text>
</TouchableOpacity>
))
)}
{tab===`vault`&&(
vaulted.length===0
?<Text style={{color:C.textMuted,fontFamily:FONT,textAlign:`center`,marginTop:24}}>No clubs in vault.</Text>
:vaulted.map(c=>(
<TouchableOpacity key={c.id} onPress={()=>{onAdd(Object.assign({},c,{inBag:true}));onClose();}}
style={{flexDirection:`row`,justifyContent:`space-between`,alignItems:`center`,padding:13,backgroundColor:C.bgSurface,borderRadius:10,borderWidth:1,borderColor:C.borderGreen,marginBottom:6}}>
<Text style={{fontSize:13,color:C.textPrimary,fontFamily:FONT}}>{clubLabel(c)}</Text>
<Text style={{fontSize:11,color:C.gold,fontFamily:FONT}}>+ Add back</Text>
</TouchableOpacity>
))
)}
{tab===`custom`&&(
<View style={{gap:12}}>
<View>
<Text style={[s.label,{marginBottom:6}]}>CLUB NAME</Text>
<TextInput value={customName} onChangeText={setCustomName} placeholder=`e.g. 2 Iron` placeholderTextColor={C.textMuted} style={s.input}/>
</View>
<View>
<Text style={[s.label,{marginBottom:6}]}>CATEGORY</Text>
<View style={{flexDirection:`row`,gap:6,flexWrap:`wrap`}}>
{CATS.map(cat=>(
<TouchableOpacity key={cat} onPress={()=>setCustomCat(cat)}
style={{paddingHorizontal:12,paddingVertical:7,borderRadius:8,borderWidth:1,borderColor:customCat===cat?C.borderGold:C.borderSub,backgroundColor:customCat===cat?C.goldFaint:`transparent`}}>
<Text style={{fontSize:12,fontFamily:FONT,color:customCat===cat?C.gold:C.textMuted}}>{cat}</Text>
</TouchableOpacity>
))}
</View>
</View>
<View>
<Text style={[s.label,{marginBottom:6}]}>CARRY DISTANCE (YDS)</Text>
<TextInput value={customDist} onChangeText={setCustomDist} keyboardType=`number-pad` placeholder=`150` placeholderTextColor={C.textMuted} style={s.input}/>
</View>
{customCat===`wedge`&&(
<View>
<Text style={[s.label,{marginBottom:6}]}>LOFT (OPTIONAL)</Text>
<TextInput value={customLoft} onChangeText={setCustomLoft} keyboardType=`number-pad` placeholder=`e.g. 52` placeholderTextColor={C.textMuted} style={s.input}/>
</View>
)}
<TouchableOpacity onPress={addCustom} style={[s.goldBtn,{marginTop:4,opacity:customName.trim()&&customDist?1:0.4}]}>
<Text style={s.goldBtnTx}>Add to Bag</Text>
</TouchableOpacity>
</View>
)}
</ScrollView>
</SafeAreaView>
</Modal>
);
}

// ─────────────────────────────────────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────────────────────────────────────
function Onboarding({onComplete}) {
const [step, setStep]         = useState(1);
const [name, setName]         = useState(EMPTY);
const [hcpInput, setHcpInput] = useState(EMPTY);
const [noHcp, setNoHcp]       = useState(false);
const [courseSearch, setCourseSearch]     = useState(EMPTY);
const [homeCourse, setHomeCourse]         = useState(null);
const [showCourseList, setShowCourseList] = useState(false);
const [bagClubs, setBagClubs] = useState(CLUBS.map(c=>(Object.assign({},c,{dist:c.defaultDist,inBag:true,make:EMPTY,model:EMPTY}))));
const [showAddModal, setShowAddModal] = useState(false);
const [mode, setMode] = useState(`semi`);

const hcp      = parseFloat(hcpInput)||12;
const hcpScale = hcp<=5?1.08:hcp<=10?1.03:hcp<=15?1.0:hcp<=20?0.96:0.91;
const canNext1 = name.trim().length>=2&&(noHcp||(!isNaN(parseFloat(hcpInput))&&hcpInput!==EMPTY));
const activeBag = bagClubs.filter(c=>c.inBag);

const applyHcpDefaults = () => setBagClubs(prev=>prev.map(c=>(Object.assign({},c,{dist:c.cat===`putter`?0:Math.round((c.defaultDist||150)*hcpScale)}))));
const filteredCourses  = COURSE_DB.filter(c=>c.name.toLowerCase().includes(courseSearch.toLowerCase())||c.city.toLowerCase().includes(courseSearch.toLowerCase()));
const removeClub = (id)      => setBagClubs(p=>p.map(c=>c.id===id?Object.assign({},c,{inBag:false}):c));
const updateDist = (id,dist) => setBagClubs(p=>p.map(c=>c.id===id?Object.assign({},c,{dist:dist}):c));
const addClub    = (newClub) => {
const exists = bagClubs.find(c=>c.id===newClub.id);
if(exists) setBagClubs(p=>p.map(c=>c.id===newClub.id?Object.assign({},c,{inBag:true}):c));
else setBagClubs(p=>p.concat([Object.assign({},newClub,{inBag:true})]));
};

const CLUB_GROUPS = [{label:`Driver & Woods`,cats:[`woods`]},{label:`Hybrids & Irons`,cats:[`hybrid`,`iron`]},{label:`Wedges`,cats:[`wedge`]},{label:`Putter`,cats:[`putter`]}];

const Progress = ()=>(
<View style={{height:2,backgroundColor:C.bgOverlay}}>
<View style={{height:2,width:`${(step/3)*100}%`,backgroundColor:C.gold}}/>
</View>
);

const finish = () => {
const obIds   = new Set(bagClubs.filter(c=>c.inBag).map(c=>c.id));
const missing = CLUBS.filter(c=>!obIds.has(c.id)).map(c=>(Object.assign({},c,{dist:c.defaultDist,inBag:false,make:EMPTY,model:EMPTY})));
onComplete({name:name.trim(),handicap:noHcp?null:parseFloat(hcpInput),homeCourse,clubs:bagClubs.filter(c=>c.inBag).concat(missing),engagementMode:mode});
};

// ── Step 1 ──────────────────────────────────────────────────────────────────
if (step===1) return (
<SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
<StatusBar barStyle=`light-content`/>
<Progress/>
<ScrollView contentContainerStyle={{padding:24,paddingTop:40}} keyboardShouldPersistTaps=`handled`>
<View style={{alignItems:`center`,marginBottom:40}}>
<View style={{flexDirection:`row`,alignItems:`baseline`,gap:8}}>
<Text style={{fontSize:28,fontWeight:`700`,letterSpacing:3,color:C.gold,fontFamily:FONT}}>PILLAR</Text>
<Text style={{color:C.goldDim,fontSize:18,fontFamily:FONT}}>&</Text>
<Text style={{fontSize:28,fontWeight:`400`,letterSpacing:4,color:C.textPrimary,fontFamily:FONT}}>SQUIRE</Text>
</View>
<Text style={{fontSize:10,color:C.textMuted,letterSpacing:2,marginTop:4,fontFamily:FONT}}>YOUR AI CADDY</Text>
</View>
<Text style={{fontSize:22,fontWeight:`700`,color:C.textPrimary,marginBottom:6,fontFamily:FONT}}>Let`s get you set up.</Text>
<Text style={{fontSize:14,color:C.textMuted,marginBottom:32,lineHeight:22,fontFamily:FONT}}>Squire needs a few things to caddy for you properly.</Text>

```
    <Text style={[s.label,{marginBottom:8}]}>YOUR NAME</Text>
    <TextInput value={name} onChangeText={setName} placeholder=`First name or nickname` placeholderTextColor={C.textMuted}
      style={[s.input,{marginBottom:20,borderColor:name.length>=2?C.borderGold:C.borderGreen}]}/>

    <Text style={[s.label,{marginBottom:8}]}>HANDICAP INDEX</Text>
    <View style={{flexDirection:`row`,gap:8,marginBottom:8}}>
      <TextInput value={hcpInput} onChangeText={t=>{setHcpInput(t);setNoHcp(false);}} placeholder=`e.g. 8.4`
        placeholderTextColor={C.textMuted} keyboardType=`decimal-pad` editable={!noHcp}
        style={[s.input,{flex:1,opacity:noHcp?0.4:1,borderColor:hcpInput&&!noHcp?C.borderGold:C.borderGreen}]}/>
      <TouchableOpacity onPress={()=>{setNoHcp(n=>!n);setHcpInput(EMPTY);}}
        style={{borderRadius:10,borderWidth:1,borderColor:noHcp?C.gold:C.borderSub,backgroundColor:noHcp?C.goldFaint:`transparent`,paddingHorizontal:14,justifyContent:`center`}}>
        <Text style={{color:noHcp?C.gold:C.textMuted,fontFamily:FONT,fontSize:11}}>No index</Text>
      </TouchableOpacity>
    </View>
    {noHcp&&<Text style={{fontSize:11,color:C.textMuted,fontStyle:`italic`,marginBottom:16,fontFamily:FONT}}>No problem — Squire builds your index as you play.</Text>}

    <Text style={[s.label,{marginBottom:8}]}>HOME COURSE <Text style={{color:C.borderSub}}>· OPTIONAL</Text></Text>
    <TextInput value={courseSearch} onChangeText={t=>{setCourseSearch(t);setShowCourseList(true);}} onFocus={()=>setShowCourseList(true)}
      placeholder=`Search your course` placeholderTextColor={C.textMuted}
      style={[s.input,{marginBottom:4,borderColor:homeCourse?C.borderGold:C.borderGreen}]}/>
    {homeCourse&&!showCourseList&&<Text style={{fontSize:11,color:C.gold,marginBottom:16,fontFamily:FONT}}>✓ {homeCourse.name}</Text>}
    {showCourseList&&filteredCourses.length>0&&(
      <View style={{backgroundColor:C.bgSurface,borderWidth:1,borderColor:C.borderGreen,borderRadius:10,marginBottom:16}}>
        {filteredCourses.slice(0,6).map(c=>(
          <TouchableOpacity key={c.id} onPress={()=>{setHomeCourse(c);setCourseSearch(c.name);setShowCourseList(false);}}
            style={{padding:12,borderBottomWidth:1,borderBottomColor:C.borderSub,backgroundColor:homeCourse?.id===c.id?C.goldFaint:`transparent`}}>
            <Text style={{fontSize:13,fontWeight:`600`,color:homeCourse?.id===c.id?C.gold:C.textPrimary,fontFamily:FONT}}>{c.name}</Text>
            <Text style={{fontSize:10,color:C.textMuted,fontFamily:FONT}}>{c.city}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
    <TouchableOpacity onPress={()=>{if(canNext1){applyHcpDefaults();setStep(2);}}} style={[s.goldBtn,{opacity:canNext1?1:0.4,marginTop:8}]}>
      <Text style={s.goldBtnTx}>Continue →</Text>
    </TouchableOpacity>
  </ScrollView>
</SafeAreaView>
```

);

// ── Step 2 ──────────────────────────────────────────────────────────────────
if (step===2) return (
<SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
<StatusBar barStyle=`light-content`/>
<Progress/>
<AddClubModal visible={showAddModal} onClose={()=>setShowAddModal(false)} onAdd={addClub} existingClubs={bagClubs}/>
<ScrollView contentContainerStyle={{padding:24,paddingTop:32}} keyboardShouldPersistTaps=`handled`>
<Text style={{fontSize:10,color:C.gold,letterSpacing:2,marginBottom:4,fontFamily:FONT}}>STEP 2 OF 3</Text>
<Text style={{fontSize:22,fontWeight:`700`,color:C.textPrimary,marginBottom:6,fontFamily:FONT}}>Your bag.</Text>
<Text style={{fontSize:13,color:C.textMuted,lineHeight:20,marginBottom:20,fontFamily:FONT,fontStyle:`italic`}}>
Scaled for a {noHcp?`typical`:hcp.toFixed(1)} handicap. Tap − to remove clubs you don`t carry. </Text> {CLUB_GROUPS.map(({label,cats})=>{ const group = activeBag.filter(c=>cats.includes(c.cat)); if(!group.length) return null; return ( <View key={label} style={{marginBottom:18}}> <View style={{borderBottomWidth:1,borderBottomColor:C.borderGold,paddingBottom:5,marginBottom:8}}> <Text style={[s.label,{color:C.gold}]}>{label.toUpperCase()}</Text> </View> {group.map(c=>( <ClubRow key={c.id} c={c} onRemove={c.removable!==false?()=>removeClub(c.id):null} onDist={(d)=>updateDist(c.id,d)}/> ))} </View> ); })} <TouchableOpacity onPress={()=>setShowAddModal(true)} style={{flexDirection:`row`,justifyContent:`center`,alignItems:`center`,gap:8,padding:14,borderRadius:12,borderWidth:1,borderColor:C.borderGold,backgroundColor:C.goldFaint,marginBottom:24}}> <Text style={{fontSize:16,color:C.gold}}>+</Text> <Text style={{fontSize:13,color:C.gold,fontFamily:FONT,fontWeight:`600`}}>Add a Club</Text> </TouchableOpacity> <View style={{flexDirection:`row`,gap:10,marginBottom:32}}>
<TouchableOpacity onPress={()=>setStep(1)} style={[s.ghostBtn,{flex:1}]}><Text style={s.ghostBtnTx}>← Back</Text></TouchableOpacity>
<TouchableOpacity onPress={()=>setStep(3)} style={[s.goldBtn,{flex:2}]}><Text style={s.goldBtnTx}>Continue →</Text></TouchableOpacity>
</View>
</ScrollView>
</SafeAreaView>
);

// ── Step 3 ──────────────────────────────────────────────────────────────────
return (
<SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
<StatusBar barStyle=`light-content`/>
<Progress/>
<ScrollView contentContainerStyle={{padding:24,paddingTop:40}}>
<View style={{alignItems:`center`,marginBottom:32}}>
<View style={{width:72,height:72,borderRadius:36,backgroundColor:C.gold,alignItems:`center`,justifyContent:`center`,marginBottom:16}}>
<Text style={{fontSize:28,color:C.textInverse,fontWeight:`800`,fontFamily:FONT}}>S</Text>
</View>
<Text style={{fontSize:22,fontWeight:`700`,color:C.textPrimary,marginBottom:8,fontFamily:FONT}}>
Meet Squire{name?`, ${name.split(` `)[0]}.`:`.`}
</Text>
<Text style={{fontSize:14,color:C.textMuted,lineHeight:22,textAlign:`center`,fontFamily:FONT}}>
{noHcp?`I`ll build your handicap index from scratch as we play together.`:`A ${hcpInput} handicap. I`ll track your SG data and tailor every recommendation to your game.`}
</Text>
</View>
<View style={[s.gCard,{marginBottom:24}]}>
<Text style={[s.label,{color:C.gold,marginBottom:8}]}>SQUIRE`S FIRST READ</Text> <Text style={{fontSize:13,color:C.textSecondary,lineHeight:22,fontFamily:FONT}}> {noHcp?`Welcome to the bag, ${name.split(` `)[0]||`friend`}. I`ll start tracking your differentials from round one. After five rounds I`ll have your index.` :parseFloat(hcpInput)<=5?`A ${hcpInput} — you know what you`re doing. I`ll focus on the details that separate good rounds from great ones.` :parseFloat(hcpInput)<=12?`${hcpInput} handicap. There are clear shots to be gained here. I`ll track your SG data and tell you exactly where.`
:`${hcpInput}. Every shot tells a story. I`ll build your dispersion profile and give you a game plan before every round.`} </Text> </View> <Text style={[s.label,{marginBottom:12}]}>HOW ACTIVE SHOULD I BE?</Text> {[{v:`reactive`,title:`On Request`,desc:`Only when you ask. Quiet caddy.`},{v:`semi`,title:`Semi-Active`,desc:`Pre-shot briefs + when you ask. Recommended.`},{v:`proactive`,title:`Full Caddy`,desc:`I`ll speak up when I see something.`}].map(m=>(
<TouchableOpacity key={m.v} onPress={()=>setMode(m.v)}
style={{flexDirection:`row`,alignItems:`center`,gap:14,padding:14,marginBottom:8,borderRadius:12,borderWidth:1,borderColor:mode===m.v?C.borderGold:C.borderSub,backgroundColor:mode===m.v?C.goldFaint:`transparent`}}>
<View style={{width:18,height:18,borderRadius:9,borderWidth:2,borderColor:mode===m.v?C.gold:C.borderSub,backgroundColor:mode===m.v?C.gold:`transparent`,alignItems:`center`,justifyContent:`center`}}>
{mode===m.v&&<View style={{width:7,height:7,borderRadius:4,backgroundColor:C.textInverse}}/>}
</View>
<View style={{flex:1}}>
<Text style={{fontSize:13,fontWeight:mode===m.v?`700`:`500`,color:mode===m.v?C.gold:C.textPrimary,fontFamily:FONT}}>{m.title}</Text>
<Text style={{fontSize:11,color:C.textMuted,fontFamily:FONT}}>{m.desc}</Text>
</View>
</TouchableOpacity>
))}
<View style={{flexDirection:`row`,gap:10,marginTop:24,marginBottom:40}}>
<TouchableOpacity onPress={()=>setStep(2)} style={[s.ghostBtn,{flex:1}]}><Text style={s.ghostBtnTx}>← Back</Text></TouchableOpacity>
<TouchableOpacity onPress={finish} style={[s.goldBtn,{flex:2}]}><Text style={s.goldBtnTx}>Let`s Play ⛳</Text></TouchableOpacity>
</View>
</ScrollView>
</SafeAreaView>
);
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function Dashboard({player, rounds, handicapIndex, setActiveTab}) {
const tp = (r) => r.score-r.course.par;
const scoreColor = (r) => tp(r)<0?C.birdie:tp(r)===0?C.par:tp(r)<=3?C.bogey:C.double;
const recent = rounds.slice(0).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3);
const displayHdcp = handicapIndex!==null?handicapIndex:player.handicap;

return (
<ScrollView style={{flex:1}} contentContainerStyle={{padding:18}}>
<View style={[s.gCard,{marginBottom:14}]}>
<Text style={[s.label,{color:C.goldDim,marginBottom:4}]}>PILLAR & SQUIRE MEMBER</Text>
<Text style={{fontSize:22,fontWeight:`700`,color:C.textPrimary,letterSpacing:0.5,fontFamily:FONT,marginBottom:2}}>{player.name}</Text>
<Text style={{fontSize:11,color:C.textMuted,fontFamily:FONT,fontStyle:`italic`,marginBottom:20}}>
{player.homeCourse?`Home: ${player.homeCourse.name}`:`Member since ${new Date().getFullYear()}`}
</Text>
<View style={{flexDirection:`row`,gap:28}}>
<View>
<Text style={[s.label,{color:C.gold,marginBottom:4}]}>HANDICAP</Text>
<Text style={{fontSize:44,fontWeight:`700`,color:C.gold,lineHeight:48,fontFamily:FONT}}>
{displayHdcp!==null?displayHdcp:`—`}
</Text>
<Text style={{fontSize:9,color:C.textMuted,fontFamily:FONT}}>
{handicapIndex!==null?`WHS INDEX`:player.handicap!==null?`ENTERED`:`NO INDEX`}
</Text>
</View>
<View>
<Text style={[s.label,{marginBottom:4}]}>ROUNDS</Text>
<Text style={{fontSize:22,fontWeight:`600`,color:C.textPrimary,fontFamily:FONT}}>{rounds.length}</Text>
<Text style={{fontSize:10,color:C.textMuted,fontFamily:FONT}}>posted</Text>
</View>
{rounds.length>0&&<View>
<Text style={[s.label,{marginBottom:4}]}>LOW ROUND</Text>
<Text style={{fontSize:22,fontWeight:`600`,color:C.birdie,fontFamily:FONT}}>{rounds.reduce((m,r)=>r.score<m?r.score:m, rounds[0].score)}</Text>
<Text style={{fontSize:10,color:C.textMuted,fontFamily:FONT}}>best</Text>
</View>}
</View>
</View>

```
  <View style={[s.gCard,{marginBottom:14}]}>
    <View style={{flexDirection:`row`,justifyContent:`space-between`,alignItems:`center`,marginBottom:12}}>
      <View>
        <Text style={{fontSize:14,fontWeight:`700`,color:C.gold,fontFamily:FONT,marginBottom:2}}>Ready to play?</Text>
        <Text style={{fontSize:11,color:C.textMuted,fontFamily:FONT}}>Get Squire`s read before you tee off</Text>
      </View>
      <Text style={{fontSize:28}}>⛳</Text>
    </View>
    <TouchableOpacity onPress={()=>setActiveTab(`Round`)} style={s.goldBtn}>
      <Text style={s.goldBtnTx}>START PRE-ROUND BRIEF</Text>
    </TouchableOpacity>
  </View>

  <View style={{marginBottom:18}}>
    <View style={{flexDirection:`row`,justifyContent:`space-between`,alignItems:`center`,marginBottom:10}}>
      <Text style={s.label}>RECENT ROUNDS</Text>
      <TouchableOpacity onPress={()=>setActiveTab(`The Card`)}>
        <Text style={{fontSize:10,color:C.gold,fontFamily:FONT,letterSpacing:1}}>VIEW ALL →</Text>
      </TouchableOpacity>
    </View>
    {recent.length===0?(
      <View style={[s.card,{alignItems:`center`,padding:24}]}>
        <Text style={{fontSize:13,color:C.textMuted,fontFamily:FONT}}>No rounds yet. Tee it up.</Text>
      </View>
    ):recent.map(r=>(
      <View key={r.id} style={[s.card,{flexDirection:`row`,justifyContent:`space-between`,alignItems:`center`,borderLeftWidth:3,borderLeftColor:C.gold}]}>
        <View>
          <Text style={{fontSize:13,fontWeight:`600`,color:C.textPrimary,fontFamily:FONT}}>{r.course.name}</Text>
          <Text style={{fontSize:10,color:C.textMuted,fontFamily:FONT}}>{r.date} · Diff <Text style={{color:C.gold,fontWeight:`600`}}>{r.differential}</Text></Text>
        </View>
        <View style={{alignItems:`flex-end`}}>
          <Text style={{fontSize:24,fontWeight:`700`,color:scoreColor(r),fontFamily:FONT}}>{r.score}</Text>
          <Text style={{fontSize:10,color:C.textMuted,fontFamily:FONT}}>{tp(r)>0?`+${tp(r)}`:tp(r)===0?`E`:tp(r)}</Text>
        </View>
      </View>
    ))}
    <TouchableOpacity style={[s.ghostBtn,{marginTop:4}]}>
      <Text style={s.ghostBtnTx}>+ LOG PAST ROUND</Text>
    </TouchableOpacity>
  </View>
</ScrollView>
```

);
}

// ─────────────────────────────────────────────────────────────────────────────
// BAG TAB
// ─────────────────────────────────────────────────────────────────────────────
function BagTab({clubs, setClubs}) {
const [showAddModal, setShowAddModal] = useState(false);
const activeBag = clubs.filter(c=>c.inBag);
const vaultBag  = clubs.filter(c=>!c.inBag);
const deactivate = (id)      => setClubs(cs=>cs.map(c=>c.id===id?Object.assign({},c,{inBag:false}):c));
const activate   = (id)      => setClubs(cs=>cs.map(c=>c.id===id?Object.assign({},c,{inBag:true}):c));
const updateDist = (id,dist) => setClubs(cs=>cs.map(c=>c.id===id?Object.assign({},c,{dist:dist}):c));
const addClub    = (newClub) => {
const exists = clubs.find(c=>c.id===newClub.id);
if(exists) setClubs(cs=>cs.map(c=>c.id===newClub.id?Object.assign({},c,{inBag:true}):c));
else setClubs(cs=>cs.concat([newClub]));
};
const GROUPS = [{label:`Driver & Woods`,cats:[`woods`]},{label:`Hybrids & Irons`,cats:[`hybrid`,`iron`]},{label:`Wedges`,cats:[`wedge`]},{label:`Putter`,cats:[`putter`]}];
return (
<ScrollView style={{flex:1}} contentContainerStyle={{padding:18}}>
<AddClubModal visible={showAddModal} onClose={()=>setShowAddModal(false)} onAdd={addClub} existingClubs={clubs}/>
<View style={{flexDirection:`row`,justifyContent:`space-between`,alignItems:`center`,marginBottom:14}}>
<View>
<Text style={{fontSize:16,fontWeight:`700`,color:C.textPrimary,fontFamily:FONT}}>My Bag</Text>
<Text style={{fontSize:11,color:activeBag.length>14?C.bogey:C.textMuted,fontFamily:FONT}}>{activeBag.length}/14 clubs{activeBag.length>14?` — over limit`:EMPTY}</Text>
</View>
<TouchableOpacity onPress={()=>setShowAddModal(true)}
style={{flexDirection:`row`,alignItems:`center`,gap:6,paddingHorizontal:14,paddingVertical:8,borderRadius:10,borderWidth:1,borderColor:C.borderGold,backgroundColor:C.goldFaint}}>
<Text style={{fontSize:14,color:C.gold}}>+</Text>
<Text style={{fontSize:12,color:C.gold,fontFamily:FONT,fontWeight:`600`}}>Add Club</Text>
</TouchableOpacity>
</View>
{GROUPS.map(({label,cats})=>{
const group = activeBag.filter(c=>cats.includes(c.cat));
if(!group.length) return null;
return (
<View key={label} style={{marginBottom:18}}>
<View style={{borderBottomWidth:1,borderBottomColor:C.borderGold,paddingBottom:5,marginBottom:8}}>
<Text style={[s.label,{color:C.gold}]}>{label.toUpperCase()}</Text>
</View>
{group.map(c=><ClubRow key={c.id} c={c} onRemove={c.removable!==false?()=>deactivate(c.id):null} onDist={(d)=>updateDist(c.id,d)}/>)}
</View>
);
})}
{vaultBag.length>0&&(
<View style={{marginBottom:18}}>
<View style={{borderBottomWidth:1,borderBottomColor:C.borderSub,paddingBottom:5,marginBottom:8,flexDirection:`row`,justifyContent:`space-between`}}>
<Text style={[s.label,{color:C.textMuted}]}>VAULT — NOT IN BAG</Text>
<Text style={[s.label,{color:C.textMuted}]}>{vaultBag.length}</Text>
</View>
{vaultBag.map(c=><ClubRow key={c.id} c={c} showVault onActivate={()=>activate(c.id)}/>)}
</View>
)}
</ScrollView>
);
}

// ─────────────────────────────────────────────────────────────────────────────
// THE CARD / SQUIRE / ROUND placeholders
// ─────────────────────────────────────────────────────────────────────────────
function TheCard({rounds, player}) {
const sorted = rounds.slice(0).sort((a,b)=>new Date(b.date)-new Date(a.date));
return (
<ScrollView contentContainerStyle={{padding:18}}>
<Text style={[s.label,{color:C.gold,marginBottom:12}]}>STATS & HISTORY</Text>
{sorted.length===0?(
<View style={[s.card,{alignItems:`center`,padding:32}]}>
<Text style={{fontSize:13,color:C.textMuted,fontFamily:FONT}}>Play some rounds to see your stats here.</Text>
</View>
):sorted.map(r=>(
<View key={r.id} style={[s.card,{flexDirection:`row`,justifyContent:`space-between`,alignItems:`center`}]}>
<View>
<Text style={{fontSize:13,fontWeight:`600`,color:C.textPrimary,fontFamily:FONT}}>{r.course.name}</Text>
<Text style={{fontSize:10,color:C.textMuted,fontFamily:FONT}}>{r.date}</Text>
</View>
<View style={{alignItems:`flex-end`}}>
<Text style={{fontSize:22,fontWeight:`700`,color:r.score-r.course.par<=0?C.birdie:C.bogey,fontFamily:FONT}}>{r.score}</Text>
<Text style={{fontSize:10,color:C.gold,fontFamily:FONT}}>Diff {r.differential}</Text>
</View>
</View>
))}
</ScrollView>
);
}

function RoundTab() {
return (
<View style={{flex:1,alignItems:`center`,justifyContent:`center`,padding:24}}>
<Text style={{fontSize:40,marginBottom:16}}>⛳</Text>
<Text style={{fontSize:22,fontWeight:`700`,color:C.textPrimary,fontFamily:FONT,marginBottom:8}}>Round</Text>
<Text style={{fontSize:14,color:C.textMuted,fontFamily:FONT,textAlign:`center`}}>Full round tracking coming in the next build.</Text>
</View>
);
}

function SquireTab() {
return (
<View style={{flex:1,alignItems:`center`,justifyContent:`center`,padding:24}}>
<View style={{width:72,height:72,borderRadius:36,backgroundColor:C.gold,alignItems:`center`,justifyContent:`center`,marginBottom:16}}>
<Text style={{fontSize:28,color:C.textInverse,fontWeight:`800`,fontFamily:FONT}}>S</Text>
</View>
<Text style={{fontSize:22,fontWeight:`700`,color:C.textPrimary,fontFamily:FONT,marginBottom:8}}>Squire</Text>
<Text style={{fontSize:14,color:C.textMuted,fontFamily:FONT,textAlign:`center`,lineHeight:22}}>Full AI caddy chat coming in the next build.</Text>
</View>
);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
const TABS      = [`Dashboard`,`Round`,`Bag`,`The Card`,`Squire`];
const TAB_ICONS = {Dashboard:`⬡`,Round:`⛳`,Bag:`◉`,`The Card`:`◈`,Squire:`✦`};

export default function PillarSquire() {
const [onboarded, setOnboarded] = useState(false);
const [player,    setPlayer]    = useState({name:EMPTY,id:EMPTY,handicap:null,homeCourse:null});
const [clubs,     setClubs]     = useState(CLUBS.map(c=>(Object.assign({},c,{dist:c.defaultDist,inBag:true,make:EMPTY,model:EMPTY}))));
const [rounds,    setRounds]    = useState([]);
const [activeTab, setActiveTab] = useState(`Dashboard`);

const handicapIndex = calcHandicapIndex(rounds);
const displayHdcp   = handicapIndex!==null?handicapIndex:player.handicap;

const handleOnboardingComplete = (profile) => {
setPlayer({name:profile.name,id:`PS-`+Math.floor(10000+Math.random()*90000),handicap:profile.handicap,homeCourse:profile.homeCourse});
setClubs(profile.clubs);
setOnboarded(true);
};

if (!onboarded) return <Onboarding onComplete={handleOnboardingComplete}/>;

const renderTab = () => {
if (activeTab===`Dashboard`) return <Dashboard player={player} rounds={rounds} handicapIndex={handicapIndex} setActiveTab={setActiveTab}/>;
if (activeTab===`Round`)     return <RoundTab/>;
if (activeTab===`Bag`)       return <BagTab clubs={clubs} setClubs={setClubs}/>;
if (activeTab===`The Card`)  return <TheCard rounds={rounds} player={player}/>;
if (activeTab===`Squire`)    return <SquireTab/>;
};

return (
<SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
<StatusBar barStyle=`light-content`/>
<View style={{paddingHorizontal:20,paddingVertical:10,borderBottomWidth:1,borderBottomColor:C.borderGold,flexDirection:`row`,justifyContent:`space-between`,alignItems:`center`,backgroundColor:`rgba(6,13,9,0.97)`}}>
<View>
<View style={{flexDirection:`row`,alignItems:`baseline`,gap:6}}>
<Text style={{fontSize:17,fontWeight:`700`,letterSpacing:2,color:C.gold,fontFamily:FONT}}>PILLAR</Text>
<Text style={{color:C.goldDim,fontSize:12,fontFamily:FONT}}>&</Text>
<Text style={{fontSize:17,fontWeight:`400`,letterSpacing:2,color:C.textPrimary,fontFamily:FONT}}>SQUIRE</Text>
</View>
<Text style={{fontSize:8,color:C.textMuted,letterSpacing:1.5,fontFamily:FONT}}>GOLF COMPANION · {player.name.toUpperCase()}</Text>
</View>
<View style={{alignItems:`flex-end`}}>
<Text style={[s.label,{color:C.gold}]}>HDCP</Text>
<Text style={{fontSize:22,fontWeight:`700`,color:C.gold,lineHeight:26,fontFamily:FONT}}>{displayHdcp!==null?displayHdcp:`—`}</Text>
</View>
</View>
<View style={{flex:1}}>{renderTab()}</View>
<View style={{flexDirection:`row`,borderTopWidth:1,borderTopColor:C.borderGold,backgroundColor:C.bgSurface,paddingBottom:8,paddingTop:8}}>
{TABS.map(tab=>{
const active = activeTab===tab;
return (
<TouchableOpacity key={tab} onPress={()=>setActiveTab(tab)} style={{flex:1,alignItems:`center`,paddingVertical:4}}>
<Text style={{fontSize:16,marginBottom:2,opacity:active?1:0.4}}>{TAB_ICONS[tab]}</Text>
<Text style={{fontSize:9,fontFamily:FONT,letterSpacing:0.3,color:active?C.gold:C.textMuted,fontWeight:active?`700`:`400`}}>{tab}</Text>
{active&&<View style={{width:20,height:2,backgroundColor:C.gold,borderRadius:1,marginTop:2}}/>}
</TouchableOpacity>
);
})}
</View>
</SafeAreaView>
);
}