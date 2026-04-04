const React = require(/react/.source);
const { useState } = React;
const RN = require(/react-native/.source);
const { View, Text, ScrollView, TouchableOpacity, TextInput,
StatusBar, SafeAreaView, StyleSheet, Modal } = RN;

const C = {
bg:/#060D09/.source, bgSurface:/#0C1810/.source, bgOverlay:/#172A1A/.source,
gold:/#C9A84C/.source, goldLight:/#DFC06A/.source, goldDim:/#8A6F2E/.source,
goldFaint:/rgba(201,168,76,0.12)/.source,
greenBright:/#3D8B50/.source, greenMid:/#2A5C35/.source,
textPrimary:/#F0EBE0/.source, textSecondary:/#A89880/.source,
textMuted:/#5C5245/.source, textInverse:/#060D09/.source,
birdie:/#3D8B50/.source, par:/#F0EBE0/.source,
bogey:/#C9724C/.source, double:/#A84C3A/.source, eagle:/#DFC06A/.source,
borderGold:/rgba(201,168,76,0.22)/.source,
borderGreen:/rgba(42,92,53,0.5)/.source,
borderSub:/rgba(240,235,224,0.07)/.source,
};
const FONT = /Georgia/.source;
const EMPTY = [].join();
const BOLD = /700/.source;
const SEMI = /600/.source;
const NORMAL = /400/.source;
const W800 = /800/.source;
const ITALIC = /italic/.source;
const ROW = /row/.source;
const CENTER = /center/.source;
const FLEX_END = /flex-end/.source;
const SPACE_BTW = /space-between/.source;
const HIDDEN = /hidden/.source;
const TRANSPARENT = /transparent/.source;
const STRETCH = /stretch/.source;
const BASELINE = /baseline/.source;
const LIGHT_CONTENT = /light-content/.source;
const PAGE_SHEET = /pageSheet/.source;
const SLIDE = /slide/.source;
const HANDLED = /handled/.source;
const DECIMAL = /decimal-pad/.source;
const NUMBER = /number-pad/.source;
const TYPICAL = /typical/.source;
const DOT = /./.source;
const COMMA_SP = /, /.source;
const PLUS = /+/.source;
const E_PAR = /E/.source;
const DASH = /\u2014/.source;
const FRIEND = /friend/.source;
const SP = / /.source;
const PCT = /%/.source;
const OVER_LIMIT = / - over limit/.source;
const WHS_IDX = /WHS INDEX/.source;
const ENTERED_LBL = /ENTERED/.source;
const NO_IDX = /NO INDEX/.source;
const HOME_PFX = /Home: /.source;
const MEMBER_PFX = /Member since /.source;
const BG_APP_DARK = /rgba(6,13,9,0.97)/.source;
const TAB_DASH = /Dashboard/.source;
const TAB_ROUND = /Round/.source;
const TAB_BAG = /Bag/.source;
const TAB_CARD = /The Card/.source;
const TAB_SQUIRE = /Squire/.source;
const TAB_PRESET = /preset/.source;
const TAB_VAULT = /vault/.source;
const TAB_CUSTOM = /custom/.source;
const LBL_STANDARD = /Standard/.source;
const LBL_VAULT = /Vault/.source;
const LBL_CUSTOM = /Custom/.source;
const CAT_WOODS = /woods/.source;
const CAT_HYBRID = /hybrid/.source;
const CAT_IRON = /iron/.source;
const CAT_WEDGE = /wedge/.source;
const CAT_PUTTER = /putter/.source;
const MODE_REACTIVE = /reactive/.source;
const MODE_SEMI = /semi/.source;
const MODE_PROACTIVE = /proactive/.source;
const PS_PREFIX = /PS-/.source;
const ICON_WOOD = /\u25b2/.source;
const ICON_HYB = /\u25c6/.source;
const ICON_IRON = /\u2014/.source;
const ICON_WEDGE = /\u25d0/.source;
const ICON_PUTT = /\u25cf/.source;
const PH_NAME = /First name or nickname/.source;
const PH_HCP = /e.g. 8.4/.source;
const PH_COURSE = /Search your course/.source;
const PH_CLUB = /e.g. 2 Iron/.source;
const PH_DIST = /150/.source;
const PH_LOFT = /e.g. 52/.source;

const MODE_OPTIONS = [
{v:MODE_REACTIVE, title:/On Request/.source,  desc:/Only when you ask. Quiet caddy./.source},
{v:MODE_SEMI,     title:/Semi-Active/.source, desc:/Pre-shot briefs and when you ask. Recommended./.source},
{v:MODE_PROACTIVE,title:/Full Caddy/.source,  desc:/Ill speak up when I see something./.source},
];

const CLUBS = [
{id:/driver/.source, name:/Driver/.source,     cat:CAT_WOODS,  icon:ICON_WOOD, defaultDist:260, removable:false},
{id:/3w/.source,     name:/3 Wood/.source,     cat:CAT_WOODS,  icon:ICON_WOOD, defaultDist:230, removable:true},
{id:/5w/.source,     name:/5 Wood/.source,     cat:CAT_WOODS,  icon:ICON_WOOD, defaultDist:215, removable:true},
{id:/3h/.source,     name:/3 Hybrid/.source,   cat:CAT_HYBRID, icon:ICON_HYB,  defaultDist:205, removable:true},
{id:/4i/.source,     name:/4 Iron/.source,     cat:CAT_IRON,   icon:ICON_IRON, defaultDist:195, removable:true},
{id:/5i/.source,     name:/5 Iron/.source,     cat:CAT_IRON,   icon:ICON_IRON, defaultDist:183, removable:true},
{id:/6i/.source,     name:/6 Iron/.source,     cat:CAT_IRON,   icon:ICON_IRON, defaultDist:170, removable:true},
{id:/7i/.source,     name:/7 Iron/.source,     cat:CAT_IRON,   icon:ICON_IRON, defaultDist:157, removable:false},
{id:/8i/.source,     name:/8 Iron/.source,     cat:CAT_IRON,   icon:ICON_IRON, defaultDist:144, removable:true},
{id:/9i/.source,     name:/9 Iron/.source,     cat:CAT_IRON,   icon:ICON_IRON, defaultDist:132, removable:true},
{id:/pw/.source,     name:/PW/.source,         cat:CAT_IRON,   icon:ICON_IRON, defaultDist:120, removable:true},
{id:/gw/.source,     name:/Gap Wedge/.source,  cat:CAT_WEDGE,  icon:ICON_WEDGE,defaultDist:108, removable:true,  loft:50},
{id:/sw/.source,     name:/Sand Wedge/.source, cat:CAT_WEDGE,  icon:ICON_WEDGE,defaultDist:90,  removable:true,  loft:54},
{id:/lw/.source,     name:/Lob Wedge/.source,  cat:CAT_WEDGE,  icon:ICON_WEDGE,defaultDist:72,  removable:true,  loft:60},
{id:/pt/.source,     name:/Putter/.source,     cat:CAT_PUTTER, icon:ICON_PUTT, defaultDist:0,   removable:false},
];

const COURSE_DB = [
{id:1,  name:/Bethpage Black/.source,          city:/Farmingdale, NY/.source,  rating:76.6, slope:155, par:71},
{id:2,  name:/Pebble Beach Golf Links/.source, city:/Pebble Beach, CA/.source, rating:74.7, slope:145, par:72},
{id:3,  name:/Rockaway River CC/.source,       city:/Denville, NJ/.source,     rating:71.2, slope:122, par:71},
{id:4,  name:/Berkshire Valley Golf/.source,   city:/Oak Ridge, NJ/.source,    rating:73.4, slope:131, par:72},
{id:5,  name:/Ballyowen Golf Club/.source,     city:/Hamburg, NJ/.source,      rating:74.3, slope:138, par:72},
{id:6,  name:/Hominy Hill GC/.source,          city:/Colts Neck, NJ/.source,   rating:73.9, slope:133, par:72},
{id:7,  name:/Flanders Valley/.source,         city:/Flanders, NJ/.source,     rating:72.1, slope:126, par:72},
{id:8,  name:/Architects Golf Club/.source,    city:/Lopatcong, NJ/.source,    rating:74.1, slope:136, par:72},
{id:9,  name:/Twisted Dune GC/.source,         city:/Egg Harbor, NJ/.source,   rating:74.1, slope:136, par:72},
{id:10, name:/Winged Foot (West)/.source,    city:/Mamaroneck, NY/.source,   rating:75.8, slope:143, par:72},
];

const calcHandicapIndex = (rounds) => {
if (!rounds || rounds.length < 3) return null;
const diffs = rounds.slice(0).sort((a,b) => a.differential - b.differential);
const n = rounds.length<=6?1:rounds.length<=9?2:rounds.length<=11?3:
rounds.length<=13?4:rounds.length<=15?5:rounds.length<=16?6:
rounds.length<=17?7:rounds.length<=18?8:rounds.length<=19?9:10;
const best = diffs.slice(0,n);
return parseFloat((best.reduce((a,b)=>a+b.differential,0)/n*0.96).toFixed(1));
};

const s = StyleSheet.create({
label:     {fontSize:9,  fontFamily:FONT, color:C.textMuted, letterSpacing:1.4, fontWeight:SEMI},
card:      {backgroundColor:C.bgSurface, borderRadius:12, borderWidth:1, borderColor:C.borderGreen, padding:14, marginBottom:10},
gCard:     {backgroundColor:C.bgSurface, borderRadius:12, borderWidth:1, borderColor:C.borderGold,  padding:14, marginBottom:10},
goldBtn:   {backgroundColor:C.gold, borderRadius:12, padding:14, alignItems:CENTER},
goldBtnTx: {color:C.textInverse, fontFamily:FONT, fontWeight:BOLD, fontSize:14},
ghostBtn:  {borderRadius:12, borderWidth:1, borderColor:C.borderGreen, padding:14, alignItems:CENTER},
ghostBtnTx:{color:C.textSecondary, fontFamily:FONT, fontSize:13},
input:     {backgroundColor:C.bgOverlay, borderWidth:1, borderColor:C.borderGreen, borderRadius:10, padding:12, fontSize:15, color:C.textPrimary, fontFamily:FONT},
});

const clubColor = (cat) => ({[CAT_WOODS]:C.gold,[CAT_HYBRID]:C.goldLight,[CAT_IRON]:C.greenBright,[CAT_WEDGE]:C.textSecondary,[CAT_PUTTER]:C.textMuted}[cat]||C.textSecondary);
const clubLabel = (c) => c.cat===CAT_WEDGE&&c.loft ? c.loft+/\u00b0 Wedge/.source : c.name;

function ClubRow({c, onRemove, onActivate, onDist, showVault}) {
return (
<View style={{flexDirection:ROW,alignItems:CENTER,backgroundColor:C.bgSurface,borderWidth:1,borderColor:showVault?C.borderSub:C.borderGreen,borderRadius:10,marginBottom:5,overflow:HIDDEN,opacity:showVault?0.7:1}}>
<View style={{flex:1,flexDirection:ROW,alignItems:CENTER,padding:12,gap:10}}>
<Text style={{fontSize:11,color:clubColor(c.cat),width:14,textAlign:CENTER}}>{c.icon}</Text>
<View style={{flex:1}}>
<Text style={{fontSize:14,color:C.textPrimary,fontFamily:FONT}}>{clubLabel(c)}</Text>
{(c.make||c.model)?<Text style={{fontSize:10,color:C.textMuted,fontFamily:FONT}}>{[c.make,c.model].filter(Boolean).join(SP)}</Text>:null}
</View>
{c.cat!==CAT_PUTTER&&(
<View style={{flexDirection:ROW,alignItems:CENTER,gap:6}}>
{onDist&&<TouchableOpacity onPress={()=>onDist(Math.max(0,c.dist-5))} style={{width:28,height:28,borderRadius:6,borderWidth:1,borderColor:C.borderSub,backgroundColor:C.bgOverlay,alignItems:CENTER,justifyContent:CENTER}}>
<Text style={{color:C.textSecondary,fontSize:14}}>{/\u2212/.source}</Text>
</TouchableOpacity>}
<Text style={{fontSize:16,fontWeight:BOLD,color:clubColor(c.cat),minWidth:36,textAlign:CENTER,fontFamily:FONT}}>{c.dist}</Text>
{onDist&&<TouchableOpacity onPress={()=>onDist(c.dist+5)} style={{width:28,height:28,borderRadius:6,borderWidth:1,borderColor:C.borderSub,backgroundColor:C.bgOverlay,alignItems:CENTER,justifyContent:CENTER}}>
<Text style={{color:C.textSecondary,fontSize:14}}>{PLUS}</Text>
</TouchableOpacity>}
</View>
)}
</View>
{onRemove&&<TouchableOpacity onPress={onRemove} style={{paddingHorizontal:14,alignSelf:STRETCH,justifyContent:CENTER,borderLeftWidth:1,borderLeftColor:C.borderSub}}>
<Text style={{color:C.textMuted,fontSize:14}}>{/x/.source}</Text>
</TouchableOpacity>}
{onActivate&&<TouchableOpacity onPress={onActivate} style={{paddingHorizontal:14,alignSelf:STRETCH,justifyContent:CENTER,borderLeftWidth:1,borderLeftColor:C.borderSub}}>
<Text style={{color:C.gold,fontSize:11,fontFamily:FONT}}>{/+ Add/.source}</Text>
</TouchableOpacity>}
</View>
);
}

function AddClubModal({visible, onClose, onAdd, existingClubs}) {
const [tab, setTab]               = useState(TAB_PRESET);
const [customName, setCustomName] = useState(EMPTY);
const [customCat,  setCustomCat]  = useState(CAT_IRON);
const [customDist, setCustomDist] = useState(PH_DIST);
const [customLoft, setCustomLoft] = useState(EMPTY);

const existingIds = new Set(existingClubs.map(c=>c.id));
const presets = CLUBS.filter(c=>!existingIds.has(c.id));
const vaulted = existingClubs.filter(c=>!c.inBag);
const CATS = [CAT_WOODS,CAT_HYBRID,CAT_IRON,CAT_WEDGE,CAT_PUTTER];
const catIcons = {[CAT_WOODS]:ICON_WOOD,[CAT_HYBRID]:ICON_HYB,[CAT_IRON]:ICON_IRON,[CAT_WEDGE]:ICON_WEDGE,[CAT_PUTTER]:ICON_PUTT};

const addCustom = () => {
if (!customName.trim()||!customDist) return;
onAdd({id:/custom_/.source+Date.now(), name:customName.trim(), cat:customCat,
icon:catIcons[customCat]||ICON_IRON, dist:parseInt(customDist)||150,
defaultDist:parseInt(customDist)||150,
loft:customLoft?parseInt(customLoft):null, make:EMPTY, model:EMPTY, inBag:true, removable:true});
setCustomName(EMPTY); setCustomDist(PH_DIST); setCustomLoft(EMPTY);
onClose();
};

return (
<Modal visible={visible} animationType={SLIDE} presentationStyle={PAGE_SHEET} onRequestClose={onClose}>
<SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
<View style={{flexDirection:ROW,justifyContent:SPACE_BTW,alignItems:CENTER,padding:18,borderBottomWidth:1,borderBottomColor:C.borderGold}}>
<Text style={{fontSize:16,fontWeight:BOLD,color:C.textPrimary,fontFamily:FONT}}>Add Club</Text>
<TouchableOpacity onPress={onClose}><Text style={{fontSize:18,color:C.textMuted}}>x</Text></TouchableOpacity>
</View>
<View style={{flexDirection:ROW,padding:12,gap:8}}>
{[{v:TAB_PRESET,l:LBL_STANDARD},{v:TAB_VAULT,l:LBL_VAULT},{v:TAB_CUSTOM,l:LBL_CUSTOM}].map(t=>(
<TouchableOpacity key={t.v} onPress={()=>setTab(t.v)}
style={{flex:1,padding:9,borderRadius:9,borderWidth:1,borderColor:tab===t.v?C.borderGold:C.borderSub,backgroundColor:tab===t.v?C.goldFaint:TRANSPARENT,alignItems:CENTER}}>
<Text style={{fontSize:11,fontFamily:FONT,color:tab===t.v?C.gold:C.textMuted,fontWeight:tab===t.v?BOLD:NORMAL}}>{t.l}</Text>
</TouchableOpacity>
))}
</View>
<ScrollView contentContainerStyle={{padding:16}} keyboardShouldPersistTaps={HANDLED}>
{tab===TAB_PRESET&&(
presets.length===0
?<Text style={{color:C.textMuted,fontFamily:FONT,textAlign:CENTER,marginTop:24}}>All standard clubs already in bag.</Text>
:presets.map(c=>(
<TouchableOpacity key={c.id} onPress={()=>{onAdd(Object.assign({},c,{dist:c.defaultDist,inBag:true,make:EMPTY,model:EMPTY}));onClose();}}
style={{flexDirection:ROW,justifyContent:SPACE_BTW,alignItems:CENTER,padding:13,backgroundColor:C.bgSurface,borderRadius:10,borderWidth:1,borderColor:C.borderGreen,marginBottom:6}}>
<Text style={{fontSize:13,color:C.textPrimary,fontFamily:FONT}}>{c.name}</Text>
<Text style={{fontSize:11,color:C.gold,fontFamily:FONT}}>{c.defaultDist}y + Add</Text>
</TouchableOpacity>
))
)}
{tab===TAB_VAULT&&(
vaulted.length===0
?<Text style={{color:C.textMuted,fontFamily:FONT,textAlign:CENTER,marginTop:24}}>No clubs in vault.</Text>
:vaulted.map(c=>(
<TouchableOpacity key={c.id} onPress={()=>{onAdd(Object.assign({},c,{inBag:true}));onClose();}}
style={{flexDirection:ROW,justifyContent:SPACE_BTW,alignItems:CENTER,padding:13,backgroundColor:C.bgSurface,borderRadius:10,borderWidth:1,borderColor:C.borderGreen,marginBottom:6}}>
<Text style={{fontSize:13,color:C.textPrimary,fontFamily:FONT}}>{clubLabel(c)}</Text>
<Text style={{fontSize:11,color:C.gold,fontFamily:FONT}}>+ Add back</Text>
</TouchableOpacity>
))
)}
{tab===TAB_CUSTOM&&(
<View style={{gap:12}}>
<View>
<Text style={[s.label,{marginBottom:6}]}>CLUB NAME</Text>
<TextInput value={customName} onChangeText={setCustomName} placeholder={PH_CLUB} placeholderTextColor={C.textMuted} style={s.input}/>
</View>
<View>
<Text style={[s.label,{marginBottom:6}]}>CATEGORY</Text>
<View style={{flexDirection:ROW,gap:6,flexWrap:STRETCH}}>
{CATS.map(cat=>(
<TouchableOpacity key={cat} onPress={()=>setCustomCat(cat)}
style={{paddingHorizontal:12,paddingVertical:7,borderRadius:8,borderWidth:1,borderColor:customCat===cat?C.borderGold:C.borderSub,backgroundColor:customCat===cat?C.goldFaint:TRANSPARENT}}>
<Text style={{fontSize:12,fontFamily:FONT,color:customCat===cat?C.gold:C.textMuted}}>{cat}</Text>
</TouchableOpacity>
))}
</View>
</View>
<View>
<Text style={[s.label,{marginBottom:6}]}>CARRY DISTANCE (YDS)</Text>
<TextInput value={customDist} onChangeText={setCustomDist} keyboardType={NUMBER} placeholder={PH_DIST} placeholderTextColor={C.textMuted} style={s.input}/>
</View>
{customCat===CAT_WEDGE&&(
<View>
<Text style={[s.label,{marginBottom:6}]}>LOFT (OPTIONAL)</Text>
<TextInput value={customLoft} onChangeText={setCustomLoft} keyboardType={NUMBER} placeholder={PH_LOFT} placeholderTextColor={C.textMuted} style={s.input}/>
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

function Onboarding({onComplete}) {
const [step, setStep]         = useState(1);
const [name, setName]         = useState(EMPTY);
const [hcpInput, setHcpInput] = useState(EMPTY);
const [noHcp, setNoHcp]       = useState(false);
const [courseSearch, setCourseSearch]     = useState(EMPTY);
const [homeCourse, setHomeCourse]         = useState(null);
const [showCourseList, setShowCourseList] = useState(false);
const [bagClubs, setBagClubs] = useState(CLUBS.map(c=>Object.assign({},c,{dist:c.defaultDist,inBag:true,make:EMPTY,model:EMPTY})));
const [showAddModal, setShowAddModal] = useState(false);
const [mode, setMode] = useState(MODE_SEMI);

const hcp      = parseFloat(hcpInput)||12;
const hcpScale = hcp<=5?1.08:hcp<=10?1.03:hcp<=15?1.0:hcp<=20?0.96:0.91;
const canNext1 = name.trim().length>=2&&(noHcp||(!isNaN(parseFloat(hcpInput))&&hcpInput!==EMPTY));
const activeBag = bagClubs.filter(c=>c.inBag);

const applyHcpDefaults = () => setBagClubs(prev=>prev.map(c=>Object.assign({},c,{dist:c.cat===CAT_PUTTER?0:Math.round((c.defaultDist||150)*hcpScale)})));
const filteredCourses = COURSE_DB.filter(c=>c.name.toLowerCase().includes(courseSearch.toLowerCase())||c.city.toLowerCase().includes(courseSearch.toLowerCase()));
const removeClub = (id)      => setBagClubs(p=>p.map(c=>c.id===id?Object.assign({},c,{inBag:false}):c));
const updateDist = (id,dist) => setBagClubs(p=>p.map(c=>c.id===id?Object.assign({},c,{dist:dist}):c));
const addClub    = (newClub) => {
const exists = bagClubs.find(c=>c.id===newClub.id);
if(exists) setBagClubs(p=>p.map(c=>c.id===newClub.id?Object.assign({},c,{inBag:true}):c));
else setBagClubs(p=>p.concat([newClub]));
};

const CLUB_GROUPS = [
{label:/Driver and Woods/.source, cats:[CAT_WOODS]},
{label:/Hybrids and Irons/.source,cats:[CAT_HYBRID,CAT_IRON]},
{label:/Wedges/.source,           cats:[CAT_WEDGE]},
{label:/Putter/.source,           cats:[CAT_PUTTER]},
];

const Progress = () => (
<View style={{height:2,backgroundColor:C.bgOverlay}}>
<View style={{height:2,width:((step/3)*100)+PCT,backgroundColor:C.gold}}/>
</View>
);

const finish = () => {
const obIds   = new Set(bagClubs.filter(c=>c.inBag).map(c=>c.id));
const missing = CLUBS.filter(c=>!obIds.has(c.id)).map(c=>Object.assign({},c,{dist:c.defaultDist,inBag:false,make:EMPTY,model:EMPTY}));
onComplete({name:name.trim(), handicap:noHcp?null:parseFloat(hcpInput), homeCourse,
clubs:bagClubs.filter(c=>c.inBag).concat(missing), engagementMode:mode});
};

if (step===1) return (
<SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
<StatusBar barStyle={LIGHT_CONTENT}/>
<Progress/>
<ScrollView contentContainerStyle={{padding:24,paddingTop:40}} keyboardShouldPersistTaps={HANDLED}>
<View style={{alignItems:CENTER,marginBottom:40}}>
<View style={{flexDirection:ROW,alignItems:BASELINE,gap:8}}>
<Text style={{fontSize:28,fontWeight:BOLD,letterSpacing:3,color:C.gold,fontFamily:FONT}}>PILLAR</Text>
<Text style={{color:C.goldDim,fontSize:18,fontFamily:FONT}}>&</Text>
<Text style={{fontSize:28,fontWeight:NORMAL,letterSpacing:4,color:C.textPrimary,fontFamily:FONT}}>SQUIRE</Text>
</View>
<Text style={{fontSize:10,color:C.textMuted,letterSpacing:2,marginTop:4,fontFamily:FONT}}>YOUR AI CADDY</Text>
</View>
<Text style={{fontSize:22,fontWeight:BOLD,color:C.textPrimary,marginBottom:6,fontFamily:FONT}}>Lets get you set up.</Text>
<Text style={{fontSize:14,color:C.textMuted,marginBottom:32,lineHeight:22,fontFamily:FONT}}>Squire needs a few things to caddy for you properly.</Text>
<Text style={[s.label,{marginBottom:8}]}>YOUR NAME</Text>
<TextInput value={name} onChangeText={setName} placeholder={PH_NAME} placeholderTextColor={C.textMuted}
style={[s.input,{marginBottom:20,borderColor:name.length>=2?C.borderGold:C.borderGreen}]}/>
<Text style={[s.label,{marginBottom:8}]}>HANDICAP INDEX</Text>
<View style={{flexDirection:ROW,gap:8,marginBottom:8}}>
<TextInput value={hcpInput} onChangeText={t=>{setHcpInput(t);setNoHcp(false);}} placeholder={PH_HCP}
placeholderTextColor={C.textMuted} keyboardType={DECIMAL} editable={!noHcp}
style={[s.input,{flex:1,opacity:noHcp?0.4:1,borderColor:hcpInput&&!noHcp?C.borderGold:C.borderGreen}]}/>
<TouchableOpacity onPress={()=>{setNoHcp(n=>!n);setHcpInput(EMPTY);}}
style={{borderRadius:10,borderWidth:1,borderColor:noHcp?C.gold:C.borderSub,backgroundColor:noHcp?C.goldFaint:TRANSPARENT,paddingHorizontal:14,justifyContent:CENTER}}>
<Text style={{color:noHcp?C.gold:C.textMuted,fontFamily:FONT,fontSize:11}}>No index</Text>
</TouchableOpacity>
</View>
{noHcp&&<Text style={{fontSize:11,color:C.textMuted,fontStyle:ITALIC,marginBottom:16,fontFamily:FONT}}>No problem - Squire builds your index as you play.</Text>}
<Text style={[s.label,{marginBottom:8}]}>HOME COURSE</Text>
<TextInput value={courseSearch} onChangeText={t=>{setCourseSearch(t);setShowCourseList(true);}} onFocus={()=>setShowCourseList(true)}
placeholder={PH_COURSE} placeholderTextColor={C.textMuted}
style={[s.input,{marginBottom:4,borderColor:homeCourse?C.borderGold:C.borderGreen}]}/>
{homeCourse&&!showCourseList&&<Text style={{fontSize:11,color:C.gold,marginBottom:16,fontFamily:FONT}}>v {homeCourse.name}</Text>}
{showCourseList&&filteredCourses.length>0&&(
<View style={{backgroundColor:C.bgSurface,borderWidth:1,borderColor:C.borderGreen,borderRadius:10,marginBottom:16}}>
{filteredCourses.slice(0,6).map(c=>(
<TouchableOpacity key={c.id} onPress={()=>{setHomeCourse(c);setCourseSearch(c.name);setShowCourseList(false);}}
style={{padding:12,borderBottomWidth:1,borderBottomColor:C.borderSub,backgroundColor:homeCourse&&homeCourse.id===c.id?C.goldFaint:TRANSPARENT}}>
<Text style={{fontSize:13,fontWeight:BOLD,color:homeCourse&&homeCourse.id===c.id?C.gold:C.textPrimary,fontFamily:FONT}}>{c.name}</Text>
<Text style={{fontSize:10,color:C.textMuted,fontFamily:FONT}}>{c.city}</Text>
</TouchableOpacity>
))}
</View>
)}
<TouchableOpacity onPress={()=>{if(canNext1){applyHcpDefaults();setStep(2);}}} style={[s.goldBtn,{opacity:canNext1?1:0.4,marginTop:8}]}>
<Text style={s.goldBtnTx}>Continue</Text>
</TouchableOpacity>
</ScrollView>
</SafeAreaView>
);

if (step===2) return (
<SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
<StatusBar barStyle={LIGHT_CONTENT}/>
<Progress/>
<AddClubModal visible={showAddModal} onClose={()=>setShowAddModal(false)} onAdd={addClub} existingClubs={bagClubs}/>
<ScrollView contentContainerStyle={{padding:24,paddingTop:32}} keyboardShouldPersistTaps={HANDLED}>
<Text style={{fontSize:10,color:C.gold,letterSpacing:2,marginBottom:4,fontFamily:FONT}}>STEP 2 OF 3</Text>
<Text style={{fontSize:22,fontWeight:BOLD,color:C.textPrimary,marginBottom:6,fontFamily:FONT}}>Your bag.</Text>
<Text style={{fontSize:13,color:C.textMuted,lineHeight:20,marginBottom:20,fontFamily:FONT,fontStyle:ITALIC}}>
Scaled for a {noHcp?TYPICAL:hcp.toFixed(1)} handicap. Tap to remove clubs you dont carry.
</Text>
{CLUB_GROUPS.map(({label,cats})=>{
const group = activeBag.filter(c=>cats.includes(c.cat));
if(!group.length) return null;
return (
<View key={label} style={{marginBottom:18}}>
<View style={{borderBottomWidth:1,borderBottomColor:C.borderGold,paddingBottom:5,marginBottom:8}}>
<Text style={[s.label,{color:C.gold}]}>{label.toUpperCase()}</Text>
</View>
{group.map(c=><ClubRow key={c.id} c={c} onRemove={c.removable!==false?()=>removeClub(c.id):null} onDist={(d)=>updateDist(c.id,d)}/>)}
</View>
);
})}
<TouchableOpacity onPress={()=>setShowAddModal(true)}
style={{flexDirection:ROW,justifyContent:CENTER,alignItems:CENTER,gap:8,padding:14,borderRadius:12,borderWidth:1,borderColor:C.borderGold,backgroundColor:C.goldFaint,marginBottom:24}}>
<Text style={{fontSize:16,color:C.gold}}>+</Text>
<Text style={{fontSize:13,color:C.gold,fontFamily:FONT,fontWeight:BOLD}}>Add a Club</Text>
</TouchableOpacity>
<View style={{flexDirection:ROW,gap:10,marginBottom:32}}>
<TouchableOpacity onPress={()=>setStep(1)} style={[s.ghostBtn,{flex:1}]}><Text style={s.ghostBtnTx}>Back</Text></TouchableOpacity>
<TouchableOpacity onPress={()=>setStep(3)} style={[s.goldBtn,{flex:2}]}><Text style={s.goldBtnTx}>Continue</Text></TouchableOpacity>
</View>
</ScrollView>
</SafeAreaView>
);

const squireIntro = noHcp
? [/Ill build your handicap index from scratch as we play together./.source].join(EMPTY)
: [/A /.source, hcpInput, / handicap. Ill track your SG data and tailor every recommendation to your game./.source].join(EMPTY);
const nm = name.split(SP)[0]||FRIEND;
const squireRead = noHcp
? [/Welcome to the bag, /.source, nm, /. Ill start tracking your differentials from round one. After five rounds Ill have your index./.source].join(EMPTY)
: parseFloat(hcpInput)<=5
? [/A /.source, hcpInput, / - you know what youre doing. Ill focus on the details that separate good rounds from great ones./.source].join(EMPTY)
: parseFloat(hcpInput)<=12
? [hcpInput, / handicap. There are clear shots to be gained here. Ill track your SG data and tell you exactly where./.source].join(EMPTY)
: [hcpInput, /. Every shot tells a story. Ill build your dispersion profile and give you a game plan before every round./.source].join(EMPTY);

return (
<SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
<StatusBar barStyle={LIGHT_CONTENT}/>
<Progress/>
<ScrollView contentContainerStyle={{padding:24,paddingTop:40}}>
<View style={{alignItems:CENTER,marginBottom:32}}>
<View style={{width:72,height:72,borderRadius:36,backgroundColor:C.gold,alignItems:CENTER,justifyContent:CENTER,marginBottom:16}}>
<Text style={{fontSize:28,color:C.textInverse,fontWeight:W800,fontFamily:FONT}}>S</Text>
</View>
<Text style={{fontSize:22,fontWeight:BOLD,color:C.textPrimary,marginBottom:8,fontFamily:FONT}}>
Meet Squire{name?[/, /.source,name.split(SP)[0],DOT].join(EMPTY):DOT}
</Text>
<Text style={{fontSize:14,color:C.textMuted,lineHeight:22,textAlign:CENTER,fontFamily:FONT}}>
{squireIntro}
</Text>
</View>
<View style={[s.gCard,{marginBottom:24}]}>
<Text style={[s.label,{color:C.gold,marginBottom:8}]}>SQUIRES FIRST READ</Text>
<Text style={{fontSize:13,color:C.textSecondary,lineHeight:22,fontFamily:FONT}}>
{squireRead}
</Text>
</View>
<Text style={[s.label,{marginBottom:12}]}>HOW ACTIVE SHOULD I BE?</Text>
{MODE_OPTIONS.map(m=>(
<TouchableOpacity key={m.v} onPress={()=>setMode(m.v)}
style={{flexDirection:ROW,alignItems:CENTER,gap:14,padding:14,marginBottom:8,borderRadius:12,borderWidth:1,
borderColor:mode===m.v?C.borderGold:C.borderSub,backgroundColor:mode===m.v?C.goldFaint:TRANSPARENT}}>
<View style={{width:18,height:18,borderRadius:9,borderWidth:2,borderColor:mode===m.v?C.gold:C.borderSub,
backgroundColor:mode===m.v?C.gold:TRANSPARENT,alignItems:CENTER,justifyContent:CENTER}}>
{mode===m.v&&<View style={{width:7,height:7,borderRadius:4,backgroundColor:C.textInverse}}/>}
</View>
<View style={{flex:1}}>
<Text style={{fontSize:13,fontWeight:mode===m.v?BOLD:SEMI,color:mode===m.v?C.gold:C.textPrimary,fontFamily:FONT}}>{m.title}</Text>
<Text style={{fontSize:11,color:C.textMuted,fontFamily:FONT}}>{m.desc}</Text>
</View>
</TouchableOpacity>
))}
<View style={{flexDirection:ROW,gap:10,marginTop:24,marginBottom:40}}>
<TouchableOpacity onPress={()=>setStep(2)} style={[s.ghostBtn,{flex:1}]}><Text style={s.ghostBtnTx}>Back</Text></TouchableOpacity>
<TouchableOpacity onPress={finish} style={[s.goldBtn,{flex:2}]}><Text style={s.goldBtnTx}>Lets Play</Text></TouchableOpacity>
</View>
</ScrollView>
</SafeAreaView>
);
}

function Dashboard({player, rounds, handicapIndex, setActiveTab}) {
const tp = (r) => r.score-r.course.par;
const scoreColor = (r) => tp(r)<0?C.birdie:tp(r)===0?C.par:tp(r)<=3?C.bogey:C.double;
const recent = rounds.slice(0).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3);
const displayHdcp = handicapIndex!==null?handicapIndex:player.handicap;
return (
<ScrollView style={{flex:1}} contentContainerStyle={{padding:18}}>
<View style={[s.gCard,{marginBottom:14}]}>
<Text style={[s.label,{color:C.goldDim,marginBottom:4}]}>PILLAR AND SQUIRE MEMBER</Text>
<Text style={{fontSize:22,fontWeight:BOLD,color:C.textPrimary,letterSpacing:0.5,fontFamily:FONT,marginBottom:2}}>{player.name}</Text>
<Text style={{fontSize:11,color:C.textMuted,fontFamily:FONT,fontStyle:ITALIC,marginBottom:20}}>
{player.homeCourse?HOME_PFX+player.homeCourse.name:MEMBER_PFX+new Date().getFullYear()}
</Text>
<View style={{flexDirection:ROW,gap:28}}>
<View>
<Text style={[s.label,{color:C.gold,marginBottom:4}]}>HANDICAP</Text>
<Text style={{fontSize:44,fontWeight:BOLD,color:C.gold,lineHeight:48,fontFamily:FONT}}>
{displayHdcp!==null?displayHdcp:DASH}
</Text>
<Text style={{fontSize:9,color:C.textMuted,fontFamily:FONT}}>
{handicapIndex!==null?WHS_IDX:player.handicap!==null?ENTERED_LBL:NO_IDX}
</Text>
</View>
<View>
<Text style={[s.label,{marginBottom:4}]}>ROUNDS</Text>
<Text style={{fontSize:22,fontWeight:SEMI,color:C.textPrimary,fontFamily:FONT}}>{rounds.length}</Text>
<Text style={{fontSize:10,color:C.textMuted,fontFamily:FONT}}>posted</Text>
</View>
{rounds.length>0&&<View>
<Text style={[s.label,{marginBottom:4}]}>LOW ROUND</Text>
<Text style={{fontSize:22,fontWeight:SEMI,color:C.birdie,fontFamily:FONT}}>{rounds.reduce((m,r)=>r.score<m?r.score:m,rounds[0].score)}</Text>
<Text style={{fontSize:10,color:C.textMuted,fontFamily:FONT}}>best</Text>
</View>}
</View>
</View>
<View style={[s.gCard,{marginBottom:14}]}>
<View style={{flexDirection:ROW,justifyContent:SPACE_BTW,alignItems:CENTER,marginBottom:12}}>
<View>
<Text style={{fontSize:14,fontWeight:BOLD,color:C.gold,fontFamily:FONT,marginBottom:2}}>Ready to play?</Text>
<Text style={{fontSize:11,color:C.textMuted,fontFamily:FONT}}>Get Squires read before you tee off</Text>
</View>
<Text style={{fontSize:28}}>o</Text>
</View>
<TouchableOpacity onPress={()=>setActiveTab(TAB_ROUND)} style={s.goldBtn}>
<Text style={s.goldBtnTx}>START PRE-ROUND BRIEF</Text>
</TouchableOpacity>
</View>
<View style={{marginBottom:18}}>
<View style={{flexDirection:ROW,justifyContent:SPACE_BTW,alignItems:CENTER,marginBottom:10}}>
<Text style={s.label}>RECENT ROUNDS</Text>
<TouchableOpacity onPress={()=>setActiveTab(TAB_CARD)}>
<Text style={{fontSize:10,color:C.gold,fontFamily:FONT,letterSpacing:1}}>VIEW ALL</Text>
</TouchableOpacity>
</View>
{recent.length===0?(
<View style={[s.card,{alignItems:CENTER,padding:24}]}>
<Text style={{fontSize:13,color:C.textMuted,fontFamily:FONT}}>No rounds yet. Tee it up.</Text>
</View>
):recent.map(r=>(
<View key={r.id} style={[s.card,{flexDirection:ROW,justifyContent:SPACE_BTW,alignItems:CENTER,borderLeftWidth:3,borderLeftColor:C.gold}]}>
<View>
<Text style={{fontSize:13,fontWeight:SEMI,color:C.textPrimary,fontFamily:FONT}}>{r.course.name}</Text>
<Text style={{fontSize:10,color:C.textMuted,fontFamily:FONT}}>{r.date} Diff {r.differential}</Text>
</View>
<View style={{alignItems:FLEX_END}}>
<Text style={{fontSize:24,fontWeight:BOLD,color:scoreColor(r),fontFamily:FONT}}>{r.score}</Text>
<Text style={{fontSize:10,color:C.textMuted,fontFamily:FONT}}>{tp(r)>0?PLUS+tp(r):tp(r)===0?E_PAR:tp(r)}</Text>
</View>
</View>
))}
<TouchableOpacity style={[s.ghostBtn,{marginTop:4}]}>
<Text style={s.ghostBtnTx}>+ LOG PAST ROUND</Text>
</TouchableOpacity>
</View>
</ScrollView>
);
}

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
const GROUPS = [
{label:/Driver and Woods/.source, cats:[CAT_WOODS]},
{label:/Hybrids and Irons/.source,cats:[CAT_HYBRID,CAT_IRON]},
{label:/Wedges/.source,           cats:[CAT_WEDGE]},
{label:/Putter/.source,           cats:[CAT_PUTTER]},
];
return (
<ScrollView style={{flex:1}} contentContainerStyle={{padding:18}}>
<AddClubModal visible={showAddModal} onClose={()=>setShowAddModal(false)} onAdd={addClub} existingClubs={clubs}/>
<View style={{flexDirection:ROW,justifyContent:SPACE_BTW,alignItems:CENTER,marginBottom:14}}>
<View>
<Text style={{fontSize:16,fontWeight:BOLD,color:C.textPrimary,fontFamily:FONT}}>My Bag</Text>
<Text style={{fontSize:11,color:activeBag.length>14?C.bogey:C.textMuted,fontFamily:FONT}}>
{activeBag.length}/14 clubs{activeBag.length>14?OVER_LIMIT:EMPTY}
</Text>
</View>
<TouchableOpacity onPress={()=>setShowAddModal(true)}
style={{flexDirection:ROW,alignItems:CENTER,gap:6,paddingHorizontal:14,paddingVertical:8,borderRadius:10,borderWidth:1,borderColor:C.borderGold,backgroundColor:C.goldFaint}}>
<Text style={{fontSize:14,color:C.gold}}>+</Text>
<Text style={{fontSize:12,color:C.gold,fontFamily:FONT,fontWeight:BOLD}}>Add Club</Text>
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
<View style={{borderBottomWidth:1,borderBottomColor:C.borderSub,paddingBottom:5,marginBottom:8,flexDirection:ROW,justifyContent:SPACE_BTW}}>
<Text style={[s.label,{color:C.textMuted}]}>VAULT - NOT IN BAG</Text>
<Text style={[s.label,{color:C.textMuted}]}>{vaultBag.length}</Text>
</View>
{vaultBag.map(c=><ClubRow key={c.id} c={c} showVault onActivate={()=>activate(c.id)}/>)}
</View>
)}
</ScrollView>
);
}

function TheCard({rounds}) {
const sorted = rounds.slice(0).sort((a,b)=>new Date(b.date)-new Date(a.date));
return (
<ScrollView contentContainerStyle={{padding:18}}>
<Text style={[s.label,{color:C.gold,marginBottom:12}]}>STATS AND HISTORY</Text>
{sorted.length===0?(
<View style={[s.card,{alignItems:CENTER,padding:32}]}>
<Text style={{fontSize:13,color:C.textMuted,fontFamily:FONT}}>Play some rounds to see your stats here.</Text>
</View>
):sorted.map(r=>(
<View key={r.id} style={[s.card,{flexDirection:ROW,justifyContent:SPACE_BTW,alignItems:CENTER}]}>
<View>
<Text style={{fontSize:13,fontWeight:SEMI,color:C.textPrimary,fontFamily:FONT}}>{r.course.name}</Text>
<Text style={{fontSize:10,color:C.textMuted,fontFamily:FONT}}>{r.date}</Text>
</View>
<View style={{alignItems:FLEX_END}}>
<Text style={{fontSize:22,fontWeight:BOLD,color:r.score-r.course.par<=0?C.birdie:C.bogey,fontFamily:FONT}}>{r.score}</Text>
<Text style={{fontSize:10,color:C.gold,fontFamily:FONT}}>Diff {r.differential}</Text>
</View>
</View>
))}
</ScrollView>
);
}

function RoundTab() {
return (
<View style={{flex:1,alignItems:CENTER,justifyContent:CENTER,padding:24}}>
<Text style={{fontSize:40,marginBottom:16}}>o</Text>
<Text style={{fontSize:22,fontWeight:BOLD,color:C.textPrimary,fontFamily:FONT,marginBottom:8}}>Round</Text>
<Text style={{fontSize:14,color:C.textMuted,fontFamily:FONT,textAlign:CENTER}}>Full round tracking coming in the next build.</Text>
</View>
);
}

function SquireTab() {
return (
<View style={{flex:1,alignItems:CENTER,justifyContent:CENTER,padding:24}}>
<View style={{width:72,height:72,borderRadius:36,backgroundColor:C.gold,alignItems:CENTER,justifyContent:CENTER,marginBottom:16}}>
<Text style={{fontSize:28,color:C.textInverse,fontWeight:W800,fontFamily:FONT}}>S</Text>
</View>
<Text style={{fontSize:22,fontWeight:BOLD,color:C.textPrimary,fontFamily:FONT,marginBottom:8}}>Squire</Text>
<Text style={{fontSize:14,color:C.textMuted,fontFamily:FONT,textAlign:CENTER,lineHeight:22}}>Full AI caddy chat coming in the next build.</Text>
</View>
);
}

const TABS = [TAB_DASH, TAB_ROUND, TAB_BAG, TAB_CARD, TAB_SQUIRE];
const TAB_ICONS = {};
TAB_ICONS[TAB_DASH]   = /\u2b21/.source;
TAB_ICONS[TAB_ROUND]  = /o/.source;
TAB_ICONS[TAB_BAG]    = /\u25c9/.source;
TAB_ICONS[TAB_CARD]   = /\u25c8/.source;
TAB_ICONS[TAB_SQUIRE] = /\u2726/.source;

export default function PillarSquire() {
const [onboarded, setOnboarded] = useState(false);
const [player,    setPlayer]    = useState({name:EMPTY,id:EMPTY,handicap:null,homeCourse:null});
const [clubs,     setClubs]     = useState(CLUBS.map(c=>Object.assign({},c,{dist:c.defaultDist,inBag:true,make:EMPTY,model:EMPTY})));
const [rounds,    setRounds]    = useState([]);
const [activeTab, setActiveTab] = useState(TAB_DASH);

const handicapIndex = calcHandicapIndex(rounds);
const displayHdcp   = handicapIndex!==null?handicapIndex:player.handicap;

const handleOnboardingComplete = (profile) => {
setPlayer({name:profile.name, id:PS_PREFIX+Math.floor(10000+Math.random()*90000), handicap:profile.handicap, homeCourse:profile.homeCourse});
setClubs(profile.clubs);
setOnboarded(true);
};

if (!onboarded) return <Onboarding onComplete={handleOnboardingComplete}/>;

const renderTab = () => {
if (activeTab===TAB_DASH)   return <Dashboard player={player} rounds={rounds} handicapIndex={handicapIndex} setActiveTab={setActiveTab}/>;
if (activeTab===TAB_ROUND)  return <RoundTab/>;
if (activeTab===TAB_BAG)    return <BagTab clubs={clubs} setClubs={setClubs}/>;
if (activeTab===TAB_CARD)   return <TheCard rounds={rounds}/>;
if (activeTab===TAB_SQUIRE) return <SquireTab/>;
};

return (
<SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
<StatusBar barStyle={LIGHT_CONTENT}/>
<View style={{paddingHorizontal:20,paddingVertical:10,borderBottomWidth:1,borderBottomColor:C.borderGold,flexDirection:ROW,justifyContent:SPACE_BTW,alignItems:CENTER,backgroundColor:BG_APP_DARK}}>
<View>
<View style={{flexDirection:ROW,alignItems:BASELINE,gap:6}}>
<Text style={{fontSize:17,fontWeight:BOLD,letterSpacing:2,color:C.gold,fontFamily:FONT}}>PILLAR</Text>
<Text style={{color:C.goldDim,fontSize:12,fontFamily:FONT}}>&</Text>
<Text style={{fontSize:17,fontWeight:NORMAL,letterSpacing:2,color:C.textPrimary,fontFamily:FONT}}>SQUIRE</Text>
</View>
<Text style={{fontSize:8,color:C.textMuted,letterSpacing:1.5,fontFamily:FONT}}>GOLF COMPANION - {player.name.toUpperCase()}</Text>
</View>
<View style={{alignItems:FLEX_END}}>
<Text style={[s.label,{color:C.gold}]}>HDCP</Text>
<Text style={{fontSize:22,fontWeight:BOLD,color:C.gold,lineHeight:26,fontFamily:FONT}}>{displayHdcp!==null?displayHdcp:DASH}</Text>
</View>
</View>
<View style={{flex:1}}>{renderTab()}</View>
<View style={{flexDirection:ROW,borderTopWidth:1,borderTopColor:C.borderGold,backgroundColor:C.bgSurface,paddingBottom:8,paddingTop:8}}>
{TABS.map(tab=>{
const active = activeTab===tab;
return (
<TouchableOpacity key={tab} onPress={()=>setActiveTab(tab)} style={{flex:1,alignItems:CENTER,paddingVertical:4}}>
<Text style={{fontSize:16,marginBottom:2,opacity:active?1:0.4}}>{TAB_ICONS[tab]}</Text>
<Text style={{fontSize:9,fontFamily:FONT,letterSpacing:0.3,color:active?C.gold:C.textMuted,fontWeight:active?BOLD:NORMAL}}>{tab}</Text>
{active&&<View style={{width:20,height:2,backgroundColor:C.gold,borderRadius:1,marginTop:2}}/>}
</TouchableOpacity>
);
})}
</View>
</SafeAreaView>
);
}