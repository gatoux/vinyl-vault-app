import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const VinylVault = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [selectedBin, setSelectedBin] = useState(null);
  const [binViewMode, setBinViewMode] = useState('bin');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('Artist');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const [albumImages, setAlbumImages] = useState({});
  const [uploadProgress, setUploadProgress] = useState(null);
  const [scrollTimeout, setScrollTimeout] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [excludeTBD, setExcludeTBD] = useState(false);

  const EMBEDDED_DATA = [
    {"Artist":"Diana Ross","Album":"Ross","Year":"1978","Genre":"Soul","Tier":"B","Length":"39m","DateListened":"1/12","DateBought":"12/20/2024","PlaceBought":"Record Parlour","CityBought":"LA","Cost":"$7.98","NewUsed":"Used"},
    {"Artist":"Lurlean Hunter","Album":"Night Life","Year":"1957","Genre":"Lounge","Tier":"A","Length":"35m","DateListened":"1/12","DateBought":"12/20/2024","PlaceBought":"Record Parlour","CityBought":"LA","Cost":"$15.98","NewUsed":"Used"},
    {"Artist":"Masaki Ueda","Album":"After Midnight","Year":"1982","Genre":"80s","Tier":"S","Length":"42m","DateListened":"1/13","DateBought":"5/3/2024","PlaceBought":"Flash Disc Ranch","CityBought":"Tokyo","Cost":"$9.51","NewUsed":"Used"},
    {"Artist":"John Prine","Album":"John Prine","Year":"1971","Genre":"Folk/Country","Tier":"S","Length":"44m","DateListened":"1/14","DateBought":"","PlaceBought":"Gluvna","CityBought":"","Cost":"$0","NewUsed":"Used"},
    {"Artist":"Michael Hurley","Album":"Hi Fi Snock Uptown","Year":"1971","Genre":"Folk/Country","Tier":"B","Length":"42m","DateListened":"1/14","DateBought":"","PlaceBought":"Missisippi Records","CityBought":"Portland","Cost":"$12","NewUsed":"New"},
    {"Artist":"John Coltrane Quartet","Album":"Ballads","Year":"1963","Genre":"Jazz","Tier":"A","Length":"32m","DateListened":"1/15","DateBought":"","PlaceBought":"","CityBought":"Portland","Cost":"$20","NewUsed":"Used"},
    {"Artist":"Merle Haggard","Album":"Big City","Year":"1981","Genre":"Folk/Country","Tier":"B","Length":"29m","DateListened":"1/15","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"Used"},
    {"Artist":"Florence + The Machine","Album":"Ceremonials","Year":"2011","Genre":"2010s","Tier":"S","Length":"72m","DateListened":"1/16","DateBought":"","PlaceBought":"","CityBought":"Austin","Cost":"$27","NewUsed":"New"},
    {"Artist":"Taylor Swift","Album":"reputation","Year":"2017","Genre":"2010s","Tier":"B","Length":"56m","DateListened":"1/16","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":""},
    {"Artist":"Vince Guaraldi & Bota Sete","Album":"Live at El Matador","Year":"1966","Genre":"Jazz","Tier":"A","Length":"38m","DateListened":"1/16","DateBought":"","PlaceBought":"","CityBought":"Portland","Cost":"$18","NewUsed":"Used"},
    {"Artist":"Big Smoke","Album":"Time is Golden","Year":"2016","Genre":"2010s","Tier":"B","Length":"47m","DateListened":"1/17","DateBought":"9/22/2016","PlaceBought":"VMP","CityBought":"Online","Cost":"$23.00","NewUsed":"New"},
    {"Artist":"Ray Charles","Album":"Modern Sounds in Country and Western Music","Year":"1962","Genre":"Soul","Tier":"S","Length":"39m","DateListened":"1/17","DateBought":"10/1/2011","PlaceBought":"Antone's","CityBought":"Austin","Cost":"$12.99","NewUsed":"Used"},
    {"Artist":"The Beatles","Album":"Let It Be","Year":"1970","Genre":"70s","Tier":"A","Length":"35m","DateListened":"1/17","DateBought":"","PlaceBought":"","CityBought":"","Cost":"$14","NewUsed":"Used"},
    {"Artist":"The Cranberries","Album":"No Need to Argue","Year":"1994","Genre":"90s","Tier":"B","Length":"50m","DateListened":"1/17","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":""},
    {"Artist":"Amy Winehouse","Album":"Scoop The Pearls up from the Sea: Norway 2007","Year":"2015","Genre":"Soul","Tier":"A","Length":"30m","DateListened":"1/18","DateBought":"4/8/2017","PlaceBought":"Jackpot Records","CityBought":"Portland","Cost":"$24","NewUsed":"New"},
    {"Artist":"Aretha Franklin","Album":"I Never Loved a Man the Way I Love You","Year":"1967","Genre":"Soul","Tier":"S","Length":"33m","DateListened":"1/18","DateBought":"8/5/2017","PlaceBought":"Rasputin","CityBought":"SF","Cost":"$20","NewUsed":"New"},
    {"Artist":"Joey Dosik","Album":"Inside Voice","Year":"2018","Genre":"Soul","Tier":"A","Length":"38m","DateListened":"1/20","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":""},
    {"Artist":"Madonna","Album":"Like A Prayer","Year":"1989","Genre":"80s","Tier":"B","Length":"51m","DateListened":"1/20","DateBought":"7/18/2016","PlaceBought":"VMP","CityBought":"Online","Cost":"$21","NewUsed":"New"},
    {"Artist":"Woody Guthrie","Album":"Struggle","Year":"1976","Genre":"Folk/Country","Tier":"A","Length":"34m","DateListened":"1/20","DateBought":"","PlaceBought":"","CityBought":"Portland","Cost":"$10","NewUsed":""},
    {"Artist":"Jim Reeves","Album":"Jim Reeves","Year":"1957","Genre":"Lounge","Tier":"A","Length":"30m","DateListened":"1/21","DateBought":"","PlaceBought":"","CityBought":"","Cost":"$8","NewUsed":"Used"},
    {"Artist":"The Velvet Underground & Nico","Album":"The Velvet Underground & Nico","Year":"1967","Genre":"60s","Tier":"B","Length":"48m","DateListened":"1/21","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":""},
    {"Artist":"Fleetwood Mac","Album":"Rumours","Year":"1977","Genre":"70s","Tier":"S","Length":"39m","DateListened":"1/22","DateBought":"","PlaceBought":"Amoeba","CityBought":"SF","Cost":"$21","NewUsed":"New"},
    {"Artist":"Kurt Vile","Album":"Bottle it In","Year":"2018","Genre":"2010s","Tier":"A","Length":"78m","DateListened":"1/22","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":""},
    {"Artist":"Queen","Album":"Queen","Year":"1973","Genre":"70s","Tier":"B","Length":"39m","DateListened":"1/22","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":""},
    {"Artist":"Traffic","Album":"Low Spark of High Heeled Boys","Year":"1971","Genre":"70s","Tier":"A","Length":"40m","DateListened":"1/22","DateBought":"","PlaceBought":"","CityBought":"","Cost":"$8.50","NewUsed":"Used"},
    {"Artist":"Abra","Album":"Princess","Year":"2016","Genre":"Hip-Hop / R&B","Tier":"D","Length":"22m","DateListened":"1/23","DateBought":"","PlaceBought":"","CityBought":"Online","Cost":"","NewUsed":"New"},
    {"Artist":"Atlanta Rhythm Section","Album":"Champagne Jam","Year":"1978","Genre":"70s","Tier":"A","Length":"33m","DateListened":"1/23","DateBought":"10/1/2004","PlaceBought":"","CityBought":"","Cost":"$1.99","NewUsed":"Used"},
    {"Artist":"Louis Armstrong","Album":"Hello, Dolly!","Year":"1964","Genre":"Jazz","Tier":"A","Length":"37m","DateListened":"1/23","DateBought":"","PlaceBought":"Antone's","CityBought":"Austin","Cost":"$7.99","NewUsed":"Used"},
    {"Artist":"The Animals","Album":"The Best of the Animals","Year":"1966","Genre":"60s","Tier":"B","Length":"33m","DateListened":"1/23","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"Used"},
    {"Artist":"Gregg & Duane Allman","Album":"Gregg & Duane Allman","Year":"1973","Genre":"70s","Tier":"B","Length":"25m","DateListened":"1/24","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"Used"},
    {"Artist":"Various Artists","Album":"National Lampoon's Animal House (Original Motion Picture Soundtrack)","Year":"1978","Genre":"Soundtrack","Tier":"A","Length":"36m","DateListened":"1/24","DateBought":"12/11/2016","PlaceBought":"Alamo","CityBought":"SF","Cost":"$12","NewUsed":"Used"},
    {"Artist":"Aaliyah","Album":"Age Ain't Nothing But a Number","Year":"1994","Genre":"Hip-Hop / R&B","Tier":"A","Length":"49m","DateListened":"1/25","DateBought":"6/19/2017","PlaceBought":"VMP","CityBought":"Online","Cost":"$32","NewUsed":"New"},
    {"Artist":"ABBA","Album":"Gold","Year":"1992","Genre":"Funk","Tier":"B","Length":"78m","DateListened":"1/25","DateBought":"5/28/2017","PlaceBought":"Amoeba","CityBought":"SF","Cost":"$35","NewUsed":"New"},
    {"Artist":"AC/DC","Album":"Highway to Hell","Year":"1979","Genre":"70s","Tier":"A","Length":"42m","DateListened":"1/25","DateBought":"11/18/2016","PlaceBought":"Georgetown Records","CityBought":"Seattle","Cost":"$12","NewUsed":"Used"},
    {"Artist":"Allman Joys","Album":"Early Allman","Year":"1973","Genre":"70s","Tier":"C","Length":"32m","DateListened":"1/25","DateBought":"","PlaceBought":"Fantasyland","CityBought":"Atlanta","Cost":"$10","NewUsed":"Used"},
    {"Artist":"Alt-J","Album":"An Awesome Wave","Year":"2012","Genre":"2010s","Tier":"A","Length":"44m","DateListened":"1/25","DateBought":"","PlaceBought":"","CityBought":"","Cost":"$18","NewUsed":"New"},
    {"Artist":"America","Album":"History: America's Greatest Hits","Year":"1975","Genre":"70s","Tier":"C","Length":"39m","DateListened":"1/25","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"Used"},
    {"Artist":"Arcade Fire","Album":"Everything Now","Year":"2017","Genre":"2010s","Tier":"A","Length":"47m","DateListened":"1/25","DateBought":"7/30/2017","PlaceBought":"Amoeba","CityBought":"SF","Cost":"$30","NewUsed":"New"},
    {"Artist":"Lady Gaga & Bradley Cooper","Album":"A Star is Born Soundtrack","Year":"2018","Genre":"Soundtrack","Tier":"B","Length":"70m","DateListened":"1/25","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"New"},
    {"Artist":"Lynn Anderson","Album":"Listen To A Country Song","Year":"1972","Genre":"Folk/Country","Tier":"B","Length":"28m","DateListened":"1/25","DateBought":"","PlaceBought":"","CityBought":"","Cost":"$8","NewUsed":"Used"},
    {"Artist":"The Allman Brothers Band","Album":"Brothers and Sisters","Year":"1973","Genre":"70s","Tier":"S","Length":"38m","DateListened":"1/25","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":""},
    {"Artist":"The Allman Brothers Band","Album":"30 Años de Musica Rock","Year":"1984","Genre":"80s","Tier":"B","Length":"38m","DateListened":"1/25","DateBought":"","PlaceBought":"","CityBought":"Mexico City","Cost":"$11","NewUsed":""},
    {"Artist":"Louis Armstrong & Duke Ellington","Album":"Recording Together for the First Time","Year":"1961","Genre":"Jazz","Tier":"S","Length":"36m","DateListened":"1/26","DateBought":"","PlaceBought":"Grandpa George","CityBought":"Glen Ellen","Cost":"$0","NewUsed":"Used"},
    {"Artist":"The Antlers","Album":"Hospice","Year":"2009","Genre":"2000s","Tier":"D","Length":"52m","DateListened":"1/26","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"New"},
    {"Artist":"Various Artists","Album":"Music From The Motion Picture 2001: A Space Odyssey","Year":"1968","Genre":"Soundtrack","Tier":"B","Length":"36m","DateListened":"1/27","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":""},
    {"Artist":"Aerosmith","Album":"Live! Bootleg","Year":"1978","Genre":"70s","Tier":"C","Length":"75m","DateListened":"2/3","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"Used"},
    {"Artist":"The Album Leaf","Album":"Between Waves","Year":"2016","Genre":"Electronic","Tier":"B","Length":"39m","DateListened":"2/3","DateBought":"8/16/2016","PlaceBought":"VMP","CityBought":"Online","Cost":"$19","NewUsed":"New"},
    {"Artist":"Arlt","Album":"Soleil Enculé","Year":"2019","Genre":"World","Tier":"D","Length":"30m","DateListened":"2/4","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":""},
    {"Artist":"The Animals","Album":"Animalization","Year":"1966","Genre":"60s","Tier":"A","Length":"40m","DateListened":"2/4","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"Used"},
    {"Artist":"The Gregg Allman Band","Album":"The Gregg Allman Tour","Year":"1974","Genre":"70s","Tier":"A","Length":"75m","DateListened":"2/5","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"Used"},
    {"Artist":"The Allman Brothers Band","Album":"Eat a Peach","Year":"1972","Genre":"70s","Tier":"S","Length":"68m","DateListened":"2/6","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":""},
    {"Artist":"Adele","Album":"25","Year":"2015","Genre":"2010s","Tier":"S","Length":"48m","DateListened":"2/8","DateBought":"","PlaceBought":"Amoeba","CityBought":"SF","Cost":"","NewUsed":"New"},
    {"Artist":"Adele","Album":"30","Year":"2021","Genre":"2020s","Tier":"B","Length":"58m","DateListened":"2/8","DateBought":"","PlaceBought":"","CityBought":"Portland","Cost":"$21","NewUsed":"Used"},
    {"Artist":"Alabama","Album":"Pride of Dixie","Year":"1981","Genre":"Folk/Country","Tier":"C","Length":"20m","DateListened":"2/8","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"Used"},
    {"Artist":"Alabama Shakes","Album":"Boys & Girls","Year":"2012","Genre":"2010s","Tier":"A","Length":"36m","DateListened":"2/8","DateBought":"","PlaceBought":"","CityBought":"","Cost":"$15","NewUsed":"New"},
    {"Artist":"Audioslave","Album":"Audioslave","Year":"2002","Genre":"2000s","Tier":"S","Length":"65m","DateListened":"2/8","DateBought":"10/19/2017","PlaceBought":"Sound City","CityBought":"Bainbridge","Cost":"$25","NewUsed":"New"},
    {"Artist":"Duane Allman","Album":"An Anthology","Year":"1972","Genre":"70s","Tier":"B","Length":"91m","DateListened":"2/8","DateBought":"","PlaceBought":"","CityBought":"Ashland","Cost":"","NewUsed":"Used"},
    {"Artist":"Terry Allen","Album":"Juarez","Year":"1975","Genre":"Folk/Country","Tier":"B","Length":"52m","DateListened":"2/8","DateBought":"12/27/2016","PlaceBought":"Stranded","CityBought":"SF","Cost":"$18","NewUsed":"New"},
    {"Artist":"The Gregg Allman Band","Album":"Playin' Up a Storm","Year":"1977","Genre":"70s","Tier":"A","Length":"35m","DateListened":"2/8","DateBought":"10/1/2004","PlaceBought":"","CityBought":"","Cost":"$2.99","NewUsed":"Used"},
    {"Artist":"Arcade Fire","Album":"We","Year":"2022","Genre":"2020s","Tier":"A","Length":"41m","DateListened":"2/9","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"New"},
    {"Artist":"Arctic Monkeys","Album":"Whatever People Say I Am, That's What I'm Not","Year":"2006","Genre":"2000s","Tier":"A","Length":"41m","DateListened":"2/9","DateBought":"4/9/2018","PlaceBought":"VMP","CityBought":"Online","Cost":"$29","NewUsed":"New"},
    {"Artist":"Avett Brothers","Album":"The Carpenter","Year":"2012","Genre":"Folk/Country","Tier":"B","Length":"46m","DateListened":"2/9","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"New"},
    {"Artist":"Beck","Album":"ODELAY","Year":"1996","Genre":"90s","Tier":"A","Length":"55m","DateListened":"2/9","DateBought":"2/27/2017","PlaceBought":"VMP","CityBought":"Online","Cost":"$23","NewUsed":"New"},
    {"Artist":"Bo Burnham","Album":"Inside","Year":"2021","Genre":"Comedy","Tier":"A","Length":"87m","DateListened":"2/9","DateBought":"12/20/2024","PlaceBought":"Boo Boo Records","CityBought":"San Luis Obispo","Cost":"$26","NewUsed":"New"},
    {"Artist":"Blind Faith","Album":"Blind Faith","Year":"1969","Genre":"70s","Tier":"A","Length":"42m","DateListened":"2/10","DateBought":"","PlaceBought":"","CityBought":"","Cost":"$8","NewUsed":"Used"},
    {"Artist":"Blondie","Album":"Parallel Lines","Year":"1978","Genre":"70s","Tier":"A","Length":"40m","DateListened":"2/10","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"Used"},
    {"Artist":"Bad Company","Album":"Bad Company","Year":"1974","Genre":"70s","Tier":"B","Length":"34m","DateListened":"2/11","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"Used"},
    {"Artist":"Boston","Album":"Boston","Year":"1976","Genre":"70s","Tier":"A","Length":"37m","DateListened":"2/11","DateBought":"","PlaceBought":"","CityBought":"","Cost":"$8","NewUsed":"Used"},
    {"Artist":"B.B. King","Album":"Live at the Regal","Year":"1971","Genre":"Blues","Tier":"S","Length":"45m","DateListened":"2/12","DateBought":"","PlaceBought":"","CityBought":"","Cost":"$10","NewUsed":"Used"},
    {"Artist":"B.B. King","Album":"Midnight Believer","Year":"1978","Genre":"Blues","Tier":"B","Length":"40m","DateListened":"2/12","DateBought":"","PlaceBought":"","CityBought":"","Cost":"$10","NewUsed":"Used"},
    {"Artist":"Bruno Mars","Album":"Unorthodox Jukebox","Year":"2012","Genre":"Hip-Hop / R&B","Tier":"B","Length":"39m","DateListened":"2/12","DateBought":"","PlaceBought":"","CityBought":"Portland","Cost":"$26","NewUsed":"New"},
    {"Artist":"Boyz II Men","Album":"II","Year":"1994","Genre":"Hip-Hop / R&B","Tier":"B","Length":"72m","DateListened":"2/13","DateBought":"","PlaceBought":"","CityBought":"Portland","Cost":"$18","NewUsed":"New"},
    {"Artist":"Beach House","Album":"Devotion","Year":"2008","Genre":"2000s","Tier":"C","Length":"46m","DateListened":"2/15","DateBought":"","PlaceBought":"VMP","CityBought":"Online","Cost":"$23","NewUsed":"New"},
    {"Artist":"BADBADNOTGOOD","Album":"IV","Year":"2016","Genre":"Hip-Hop / R&B","Tier":"B","Length":"47m","DateListened":"2/16","DateBought":"6/19/2016","PlaceBought":"VMP","CityBought":"Online","Cost":"$23","NewUsed":"New"},
    {"Artist":"Broken. Bells","Album":"After the Disco","Year":"2014","Genre":"2010s","Tier":"C","Length":"42m","DateListened":"2/17","DateBought":"4/27/2014","PlaceBought":"Waterloo Records","CityBought":"Austin","Cost":"$28","NewUsed":"New"},
    {"Artist":"Blink-182","Album":"Enema of the State","Year":"1999","Genre":"90s","Tier":"B","Length":"35m","DateListened":"2/17","DateBought":"","PlaceBought":"","CityBought":"Portland","Cost":"","NewUsed":"New"},
    {"Artist":"Blink-182","Album":"blink-182","Year":"2003","Genre":"2000s","Tier":"B","Length":"49m","DateListened":"2/17","DateBought":"","PlaceBought":"","CityBought":"Portland","Cost":"","NewUsed":"New"},
    {"Artist":"Blink-182","Album":"California","Year":"2016","Genre":"2010s","Tier":"D","Length":"48m","DateListened":"2/17","DateBought":"","PlaceBought":"","CityBought":"Portland","Cost":"","NewUsed":"New"},
    {"Artist":"Blink-182","Album":"Take off Your Pants and Jacket","Year":"2001","Genre":"2000s","Tier":"A","Length":"37m","DateListened":"2/17","DateBought":"","PlaceBought":"","CityBought":"Portland","Cost":"","NewUsed":"New"},
    {"Artist":"Bachman-Turner Overdrive","Album":"Best of B.T.O. (So Far)","Year":"1976","Genre":"70s","Tier":"A","Length":"31m","DateListened":"2/18","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"Used"},
    {"Artist":"Bob Dylan & The Band","Album":"Before The Flood","Year":"1974","Genre":"70s","Tier":"A","Length":"82m","DateListened":"2/18","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"Used"},
    {"Artist":"Band of Horses","Album":"Cease to Begin","Year":"2007","Genre":"2000s","Tier":"B","Length":"40m","DateListened":"2/19","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":""},
    {"Artist":"Bon Iver","Album":"For Emma, Forever Ago","Year":"2007","Genre":"2000s","Tier":"B","Length":"37m","DateListened":"2/19","DateBought":"","PlaceBought":"VMP","CityBought":"Online","Cost":"$23","NewUsed":"New"},
    {"Artist":"Bon Iver","Album":"bon iver, bon iver","Year":"2011","Genre":"2010s","Tier":"A","Length":"39m","DateListened":"2/19","DateBought":"","PlaceBought":"","CityBought":"Online","Cost":"","NewUsed":"New"},
    {"Artist":"The Beatles","Album":"Rubber Soul","Year":"1965","Genre":"60s","Tier":"S","Length":"35m","DateListened":"2/20","DateBought":"","PlaceBought":"","CityBought":"Portland","Cost":"","NewUsed":"Used"},
    {"Artist":"The Beatles","Album":"Abbey Road","Year":"1969","Genre":"60s","Tier":"S","Length":"47m","DateListened":"2/20","DateBought":"2/23/2024","PlaceBought":"Passenger Seat Records","CityBought":"Portland","Cost":"$37","NewUsed":"New"},
    {"Artist":"The Beatles","Album":"Help!","Year":"1965","Genre":"60s","Tier":"B","Length":"34m","DateListened":"2/20","DateBought":"2/23/2024","PlaceBought":"Passenger Seat Records","CityBought":"Portland","Cost":"$28","NewUsed":"New"},
    {"Artist":"The Beatles","Album":"Sgt Pepper's Lonely Hearts Club Band","Year":"1967","Genre":"60s","Tier":"S","Length":"40m","DateListened":"2/20","DateBought":"2/23/2024","PlaceBought":"Passenger Seat Records","CityBought":"Portland","Cost":"$32","NewUsed":"New"},
    {"Artist":"The Beatles","Album":"Introducing... The Beatles","Year":"1964","Genre":"60s","Tier":"A","Length":"28m","DateListened":"2/20","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"Used"},
    {"Artist":"Black Sabbath","Album":"Paranoid","Year":"1970","Genre":"70s","Tier":"B","Length":"42m","DateListened":"2/21","DateBought":"","PlaceBought":"","CityBought":"Portland","Cost":"","NewUsed":"New"},
    {"Artist":"Black Sabbath","Album":"Greatest Hits","Year":"1977","Genre":"70s","Tier":"A","Length":"50m","DateListened":"2/21","DateBought":"","PlaceBought":"","CityBought":"Portland","Cost":"","NewUsed":"New"},
    {"Artist":"Black Pumas","Album":"Black Pumas","Year":"2019","Genre":"Soul","Tier":"B","Length":"47m","DateListened":"2/22","DateBought":"","PlaceBought":"Music Millenium","CityBought":"Portland","Cost":"","NewUsed":"New"},
    {"Artist":"The Books","Album":"The Lemon of Pink","Year":"2003","Genre":"Electronic","Tier":"A","Length":"52m","DateListened":"2/23","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"New"},
    {"Artist":"Bee Gees","Album":"Idea","Year":"1968","Genre":"60s","Tier":"B","Length":"33m","DateListened":"2/24","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":"Used"},
    {"Artist":"The Byrds","Album":"Turn! Turn! Turn!","Year":"1965","Genre":"60s","Tier":"B","Length":"31m","DateListened":"2/25","DateBought":"","PlaceBought":"","CityBought":"","Cost":"","NewUsed":""},
    {"Artist":"The Blues Brothers","Album":"Briefcase Full of Blues","Year":"1978","Genre":"Blues","Tier":"A","Length":"45m","DateListened":"2/26","DateBought":"","PlaceBought":"","CityBought":"Portland","Cost":"","NewUsed":"Used"}
  ];

  // Helper function to normalize genre names
  const normalizeGenre = (genre) => {
    if (!genre) return null;
    const g = genre.toLowerCase().trim();
    
    // Map various genre names to standardized format
    if (g.includes('60') || g.includes('1960')) return '1960s';
    if (g.includes('70') || g.includes('1970')) return '1970s';
    if (g.includes('80') || g.includes('1980')) return '1980s';
    if (g.includes('90') || g.includes('1990')) return '1990s';
    if (g.includes('00') || g.includes('2000')) return '2000s';
    if (g.includes('10') || g.includes('2010')) return '2010s';
    if (g.includes('20') || g.includes('2020')) return '2020s';
    if (g.includes('hip') || g.includes('r&b') || g.includes('r and b')) return 'Hip-Hop / R&B';
    if (g.includes('folk') || g.includes('country')) return 'Folk/Country';
    if (g.includes('jazz')) return 'Jazz';
    if (g.includes('soul')) return 'Soul';
    if (g.includes('funk')) return 'Funk';
    if (g.includes('blues')) return 'Blues';
    if (g.includes('class')) return 'Classical';
    if (g.includes('world')) return 'World';
    if (g.includes('lounge')) return 'Lounge';
    if (g.includes('electron')) return 'Electronic';
    if (g.includes('sound')) return 'Soundtrack';
    if (g.includes('comedy')) return 'Comedy';
    
    return genre; // Return original if no match
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from Airtable via Vercel API...');
        const response = await fetch('https://tunz2025.vercel.app/api/albums');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received', data.count, 'albums from API');
        console.log('Sample album:', data.albums[0]); // Debug: see field names
        
        // Map Airtable fields to expected format
        const processedAlbums = data.albums.map(album => {
          const genre = normalizeGenre(album['2025 Genre']);
          let tier = album['2025 Rating'];
          
          // If no rating or genre, assign to TBD
          if (!tier || !genre) {
            tier = 'TBD';
          }
          
          return {
            Artist: album.Artist,
            Album: album.Album,
            Year: album.Year,
            Genre: genre,
            Tier: tier,
            Length: album.Length,
            'Date Listened': album['Date Listened'],
            'Date Bought': album['Date Bought'],
            'Place Bought': album['Place Bought'],
            'City Bought': album['City Bought'],
            Cost: album.Cost,
            'New/Used': album['New/Used'],
            'Image URL': album['Image URL']
          };
        });
        
        const uniqueAlbums = processedAlbums.filter((album, index, self) => 
          index === self.findIndex((a) => 
            a.Artist === album.Artist && a.Album === album.Album
          )
        );
        
        console.log('Unique albums after deduplication:', uniqueAlbums.length);
        setAlbums(uniqueAlbums);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data from API:', error);
        // Fallback to embedded data if fetch fails
        console.log('Falling back to embedded data...');
        const processedAlbums = EMBEDDED_DATA.map(album => ({
          Artist: album.Artist,
          Album: album.Album,
          Year: album.Year,
          Genre: album.Genre,
          Tier: album.Tier,
          Length: album.Length,
          'Date Listened': album.DateListened,
          'Date Bought': album.DateBought,
          'Place Bought': album.PlaceBought,
          'City Bought': album.CityBought,
          Cost: album.Cost,
          'New/Used': album.NewUsed
        }));
        
        const uniqueAlbums = processedAlbums.filter((album, index, self) => 
          index === self.findIndex((a) => 
            a.Artist === album.Artist && a.Album === album.Album
          )
        );
        
        console.log('Loaded', uniqueAlbums.length, 'unique albums from embedded data');
        setAlbums(uniqueAlbums);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (currentView === 'bin' && binViewMode === 'bin' && selectedBin) {
        const binAlbums = getBinAlbums(selectedBin.type, selectedBin.value);
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCurrentIndex(prev => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setCurrentIndex(prev => Math.min(binAlbums.length - 1, prev + 1));
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentView, binViewMode, selectedBin, currentIndex, albums]);

  const getBinAlbums = (binType, binValue) => {
    return albums.filter(album => {
      if (binType === 'tier') {
        return album.Tier === binValue;
      }
      if (binType === 'decade') {
        const normalized = normalizeGenre(album.Genre);
        return normalized === binValue;
      }
      if (binType === 'genre') {
        const albumGenre = album.Genre?.toUpperCase().trim();
        const binGenre = binValue.toUpperCase().trim();
        return albumGenre === binGenre;
      }
      return false;
    });
  };

  const handleBulkImageUpload = (event) => {
    const files = Array.from(event.target.files);
    let matched = 0;
    let unmatched = [];
    const newImages = { ...albumImages };
    const matchDetails = [];

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const filename = file.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
        const parts = filename.split(' - ');
        if (parts.length >= 2) {
          const artist = parts[0].trim();
          const album = parts.slice(1).join(' - ').trim();
          
          const foundAlbum = albums.find(a => 
            a.Artist.toLowerCase() === artist.toLowerCase() && 
            a.Album.toLowerCase() === album.toLowerCase()
          );
          
          if (foundAlbum) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const imageKey = foundAlbum.Artist + '-' + foundAlbum.Album;
              newImages[imageKey] = e.target.result;
              setAlbumImages({ ...newImages });
            };
            reader.readAsDataURL(file);
            matched++;
            matchDetails.push({
              filename: file.name,
              matched: true,
              parsedArtist: artist,
              parsedAlbum: album,
              foundArtist: foundAlbum.Artist,
              foundAlbum: foundAlbum.Album
            });
          } else {
            unmatched.push(filename);
            matchDetails.push({
              filename: file.name,
              matched: false,
              parsedArtist: artist,
              parsedAlbum: album,
              reason: 'No matching album found in collection'
            });
          }
        } else {
          unmatched.push(filename);
          matchDetails.push({
            filename: file.name,
            matched: false,
            reason: 'Filename format incorrect (needs "Artist - Album")'
          });
        }
      }
    });

    console.log('=== UPLOAD DEBUG INFO ===');
    console.log('Total files:', files.length);
    console.log('Matched:', matched);
    console.log('Unmatched:', unmatched.length);
    console.log('\nDetailed match results:');
    matchDetails.forEach((detail, i) => {
      console.log(`\n${i + 1}. ${detail.filename}`);
      if (detail.matched) {
        console.log(`   ✓ MATCHED`);
        console.log(`   Parsed: "${detail.parsedArtist}" - "${detail.parsedAlbum}"`);
        console.log(`   Found:  "${detail.foundArtist}" - "${detail.foundAlbum}"`);
      } else {
        console.log(`   ✗ NOT MATCHED`);
        if (detail.parsedArtist) {
          console.log(`   Parsed: "${detail.parsedArtist}" - "${detail.parsedAlbum}"`);
        }
        console.log(`   Reason: ${detail.reason}`);
      }
    });
    
    if (unmatched.length > 0) {
      console.log('\n=== SUGGESTIONS FOR UNMATCHED FILES ===');
      matchDetails.filter(d => !d.matched && d.parsedArtist).forEach(detail => {
        const similarAlbums = albums.filter(a => 
          a.Artist.toLowerCase().includes(detail.parsedArtist.toLowerCase().substring(0, 5)) ||
          a.Album.toLowerCase().includes(detail.parsedAlbum.toLowerCase().substring(0, 5))
        ).slice(0, 3);
        
        if (similarAlbums.length > 0) {
          console.log(`\nFor "${detail.filename}":`);
          console.log('  Similar albums in collection:');
          similarAlbums.forEach(a => {
            console.log(`    - ${a.Artist} - ${a.Album}`);
          });
        }
      });
    }

    setUploadProgress({
      total: files.length,
      matched,
      unmatched,
      matchDetails
    });
  };

  const getAlbumImage = (album) => {
    // Debug: log the album object keys
    console.log('Album keys:', Object.keys(album));
    
    // Try multiple possible field names
    const imageUrl = album['Image URL'] || album['ImageURL'] || album['image url'] || album.ImageURL;
    
    if (imageUrl) {
      console.log('Found Image URL for', album.Artist, '-', album.Album, ':', imageUrl);
      return imageUrl;
    }
    
    // Fallback to the old hardcoded images (if they exist)
    const imageKey = album.Artist + '-' + album.Album;
    console.log('No Image URL found, checking hardcoded images for:', imageKey);
    return albumImages[imageKey];
  };

  const tierBins = [
    { label: 'S', color: '#ff6b9d', tier: 'S' },
    { label: 'A', color: '#ffd93d', tier: 'A' },
    { label: 'B', color: '#6bcf7f', tier: 'B' },
    { label: 'C', color: '#4ecdc4', tier: 'C' },
    { label: 'D', color: '#95a3a6', tier: 'D' },
    { label: 'TBD', color: '#6b7280', tier: 'TBD' }
  ];

  const decadeBins = [
    { label: '1960s', color: '#ff6b9d' },
    { label: '1970s', color: '#ff9d5c' },
    { label: '1980s', color: '#ffd93d' },
    { label: '1990s', color: '#6bcf7f' },
    { label: '2000s', color: '#4ecdc4' },
    { label: '2010s', color: '#a78bfa' },
    { label: '2020s', color: '#ff6b9d' }
  ];

  const genreBins = [
    { label: 'Jazz', color: '#4ecdc4' },
    { label: 'Classical', color: '#a78bfa' },
    { label: 'Folk/Country', color: '#6bcf7f' },
    { label: 'Hip-Hop / R&B', color: '#ff6b9d' },
    { label: 'Soul', color: '#ff6b9d' },
    { label: 'Funk', color: '#ff9d5c' },
    { label: 'World', color: '#6bcf7f' },
    { label: 'Blues', color: '#4ecdc4' },
    { label: 'Lounge', color: '#a78bfa' },
    { label: 'Electronic', color: '#4ecdc4' },
    { label: 'Soundtrack', color: '#ffd93d' },
    { label: 'Comedy', color: '#ff9d5c' },
    { label: 'Holiday', color: '#6bcf7f' }
  ];

  const RecordBin = ({ albums, color, label, onClick }) => {
    const count = albums.length;
    // Use brown gradient for most bins, but allow override (for TBD)
    const isTBD = label === 'TBD';
    
    return (
      <div className="relative cursor-pointer hover:brightness-110 transition-all"
           onClick={onClick}
           style={{ width: '110px' }}>
        <div className={isTBD ? "relative border-3 border-black rounded p-2" : "relative bg-gradient-to-br from-amber-800 to-amber-900 border-3 border-amber-950 rounded p-2"}
             style={{ 
               height: '55px',
               ...(isTBD && { background: color })
             }}>
          <div className="absolute top-1 left-0 right-0 text-center px-1 py-0.5 text-sm font-bold text-white"
               style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.9)' }}>
            {label}
          </div>
          <div className="absolute bottom-1 left-0 right-0 text-center">
            <div className="text-xs font-bold text-yellow-400" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              {count}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SmallRecordBin = ({ albums, color, label, onClick }) => {
    const count = albums.length;
    return (
      <div className="relative cursor-pointer hover:brightness-110 transition-all"
           onClick={onClick}
           style={{ width: '90px' }}>
        <div className="relative bg-gradient-to-br from-amber-800 to-amber-900 border-3 border-amber-950 rounded p-1.5"
             style={{ height: '45px' }}>
          <div className="absolute top-0.5 left-0 right-0 text-center px-1 py-0.5 text-xs font-bold text-white"
               style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.9)' }}>
            {label}
          </div>
          <div className="absolute bottom-0.5 left-0 right-0 text-center">
            <div className="text-xs font-bold text-yellow-400" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              {count}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PlaylistModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 max-w-2xl w-full border-4 border-green-400">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-green-400 font-mono">BROWSE TUNES</h2>
          <button onClick={() => setShowPlaylist(false)} className="text-white hover:text-gray-300">
            <X size={32} />
          </button>
        </div>
        <p className="text-green-300 font-mono text-lg mb-6 text-center">
          Listen while you browse the collection!
        </p>
        <div className="bg-gray-800 border-2 border-green-500 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🎧</div>
          <p className="text-gray-300 font-mono text-sm mb-6">
            Click below to open the playlist in Spotify
          </p>
          <a 
            href="spotify:playlist:74709D1dFkpSrrRiczA8xd" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-black font-bold py-4 px-8 rounded-lg font-mono text-lg transition-colors">
            OPEN PLAYLIST IN SPOTIFY
          </a>
        </div>
      </div>
    </div>
  );

  const BulkUploadModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 max-w-2xl w-full border-4 border-yellow-400">
        <h2 className="text-3xl font-bold text-yellow-400 font-mono mb-4">BULK UPLOAD IMAGES</h2>
        
        <div className="bg-gray-800 border-2 border-yellow-600 rounded p-4 mb-6">
          <p className="text-yellow-300 font-mono text-sm mb-2">INSTRUCTIONS:</p>
          <ul className="text-gray-300 text-sm space-y-1 font-mono">
            <li>• 100 albums embedded and ready for images!</li>
            <li>• Name files: Artist - Album.jpg</li>
            <li>• Example: The Beatles - Abbey Road.jpg</li>
            <li>• Artist and Album names must match exactly</li>
            <li>• Select multiple files at once</li>
            <li>• ⚠️ Images stored in memory only (lost on refresh)</li>
          </ul>
        </div>

        <label className="block w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg cursor-pointer text-center font-mono mb-4">
          SELECT IMAGE FILES
          <input 
            type="file" 
            accept="image/*" 
            multiple
            className="hidden" 
            onChange={(e) => {
              handleBulkImageUpload(e);
              e.target.value = null;
            }}
          />
        </label>

        {uploadProgress && (
          <div className="bg-gray-800 border-2 border-green-500 rounded p-4 mb-4">
            <p className="text-green-400 font-mono font-bold mb-2">✓ UPLOAD COMPLETE</p>
            <p className="text-gray-300 font-mono text-sm">Total Files: {uploadProgress.total}</p>
            <p className="text-green-400 font-mono text-sm">Matched: {uploadProgress.matched}</p>
            {uploadProgress.unmatched.length > 0 && (
              <>
                <p className="text-red-400 font-mono text-sm">Unmatched: {uploadProgress.unmatched.length}</p>
                <details className="mt-2">
                  <summary className="text-yellow-400 font-mono text-xs cursor-pointer">Show unmatched files</summary>
                  <div className="mt-2 max-h-40 overflow-y-auto">
                    {uploadProgress.unmatched.map((name, i) => (
                      <p key={i} className="text-red-300 font-mono text-xs">• {name}</p>
                    ))}
                  </div>
                </details>
              </>
            )}
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-cyan-400 font-mono text-xs mb-1">💡 Check browser console (F12) for detailed debug info:</p>
              <ul className="text-gray-400 font-mono text-xs ml-4">
                <li>• Exact parsed artist/album names</li>
                <li>• Match status for each file</li>
                <li>• Suggestions for similar albums</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button 
            onClick={() => {
              setShowUploadModal(false);
              setUploadProgress(null);
            }}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg font-mono">
            CLOSE
          </button>
          {uploadProgress && uploadProgress.matched > 0 && (
            <button 
              onClick={() => {
                setAlbumImages({});
                setUploadProgress(null);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg font-mono">
              CLEAR ALL
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const WelcomeDialog = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 pointer-events-none">
      <div className="relative bg-white border-8 border-black rounded-lg shadow-2xl max-w-md pointer-events-auto cursor-pointer"
           onClick={() => setShowWelcome(false)}>
        <div className="p-8 font-mono text-base leading-relaxed text-center">
          Welcome to Gatoux's Vinyl Vault! Click on any of the bins to browse, or click on the computer to explore the entire collection. Happy browsing!
        </div>
        <div className="flex justify-center pb-6">
          <div className="animate-pulse text-black text-4xl">
            💿
          </div>
        </div>
      </div>
    </div>
  );

  const AlbumDetail = ({ album, onClose }) => {
    const spotifySearchQuery = encodeURIComponent(album.Artist + ' ' + album.Album);
    const appleMusicSearchQuery = encodeURIComponent(album.Artist + ' ' + album.Album);
    const spotifySearchUrl = 'https://open.spotify.com/search/' + spotifySearchQuery;
    const appleMusicSearchUrl = 'https://music.apple.com/us/search?term=' + appleMusicSearchQuery;
    const albumImage = getAlbumImage(album);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
        <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-lg p-8 max-w-3xl w-full border-4 border-purple-400 max-h-screen overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300">
            <X size={32} />
          </button>
          
          <div className="flex gap-6 mb-6">
            <div className="w-64 h-64 bg-gray-600 flex items-center justify-center text-gray-400 text-sm rounded flex-shrink-0 relative overflow-hidden">
              {albumImage ? (
                <img src={albumImage} alt={album.Album} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">{album.Artist}</div>
              )}
            </div>
            
            <div className="flex-1 text-white">
              <div className="absolute top-4 right-16">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                     style={{ backgroundColor: tierBins.find(t => t.tier === album.Tier)?.color || '#999' }}>
                  {album.Tier}
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-2">{album.Artist}</h2>
              <p className="text-xl mb-6">{album.Album}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <div className="text-purple-300">Year</div>
                  <div className="font-bold">{album.Year || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-purple-300">Genre</div>
                  <div className="font-bold">{album.Genre || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-purple-300">Length</div>
                  <div className="font-bold">{album['Length'] || album['Album Length'] || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-purple-300">Listened</div>
                  <div className="font-bold">{album['Date Listened'] || 'N/A'}</div>
                </div>
              </div>

              {(album['Date Bought'] || album['Place Bought'] || album['City Bought'] || album.Cost || album['New/Used']) && (
                <div className="border-t-2 border-purple-500 pt-4 mb-6">
                  <h3 className="text-lg font-bold mb-3 text-purple-200">Purchase Info</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {album['Date Bought'] && (
                      <div>
                        <div className="text-purple-300">Date Bought</div>
                        <div className="font-bold">{album['Date Bought']}</div>
                      </div>
                    )}
                    {album['Place Bought'] && (
                      <div>
                        <div className="text-purple-300">Place Bought</div>
                        <div className="font-bold">{album['Place Bought']}</div>
                      </div>
                    )}
                    {album['City Bought'] && (
                      <div>
                        <div className="text-purple-300">City Bought</div>
                        <div className="font-bold">{album['City Bought']}</div>
                      </div>
                    )}
                    {album.Cost && (
                      <div>
                        <div className="text-purple-300">Cost</div>
                        <div className="font-bold">{album.Cost}</div>
                      </div>
                    )}
                    {album['New/Used'] && (
                      <div>
                        <div className="text-purple-300">Condition</div>
                        <div className="font-bold">{album['New/Used']}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex gap-4">
                <a href={spotifySearchUrl} target="_blank" rel="noopener noreferrer"
                   className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                  🎵 Find on Spotify
                </a>
                <a href={appleMusicSearchUrl} target="_blank" rel="noopener noreferrer"
                   className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                  🎵 Find on Apple Music
                </a>
              </div>
              
              <button onClick={onClose}
                      className="w-full mt-4 bg-purple-800 hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-2xl font-mono">LOADING VINYL VAULT...</div>
      </div>
    );
  }

  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {showWelcome && <WelcomeDialog />}
        {showPlaylist && <PlaylistModal />}
        
        <div className="text-center py-4 relative z-10">
          <h1 className="text-4xl font-bold text-yellow-400 font-mono tracking-wider mb-1"
              style={{ textShadow: '3px 3px 0px #000' }}>
            VINYL VAULT
          </h1>
          <p className="text-yellow-300 font-mono text-xs">
            {albums.length} ALBUMS IN COLLECTION | {albums.filter(a => a.Tier && a.Tier !== 'TBD').length} LISTENED TO THIS YEAR
          </p>
        </div>

        <div className="relative mx-auto" style={{ maxWidth: '1200px', height: '500px' }}>
          
          <div className="absolute inset-x-0 top-0 bottom-0" 
               style={{ 
                 background: 'linear-gradient(45deg, #b8c657 25%, transparent 25%), linear-gradient(-45deg, #b8c657 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #b8c657 75%), linear-gradient(-45deg, transparent 75%, #b8c657 75%)',
                 backgroundSize: '40px 40px',
                 backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
                 backgroundColor: '#a0b050'
               }} />
          
          <div className="absolute inset-x-0 top-0 h-24"
               style={{
                 background: 'linear-gradient(180deg, #8b7355 0%, #6b5744 100%)',
                 borderBottom: '6px solid #5a4a38'
               }} />

          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-gray-900 px-4 py-1 rounded font-mono text-yellow-400 text-xs mb-2 text-center border-2 border-yellow-600">
              BY TIER
            </div>
            <div className="flex gap-3 justify-center">
              {tierBins.filter(bin => bin.tier !== 'TBD').map(bin => (
                <RecordBin 
                  key={bin.tier}
                  albums={getBinAlbums('tier', bin.tier)} 
                  color={bin.color} 
                  label={bin.label}
                  onClick={() => {
                    setSelectedBin({ type: 'tier', value: bin.tier, label: bin.label + ' Tier', color: bin.color });
                    setCurrentView('bin');
                    setCurrentIndex(0);
                  }}
                />
              ))}
            </div>
          </div>

          {/* TBD Bin - positioned to the left of search computer */}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30" style={{ marginLeft: '-200px' }}>
            <RecordBin 
              albums={getBinAlbums('tier', 'TBD')} 
              color="#6b7280"
              label="TBD"
              onClick={() => {
                setSelectedBin({ type: 'tier', value: 'TBD', label: 'TBD Albums', color: '#6b7280' });
                setCurrentView('bin');
                setCurrentIndex(0);
              }}
            />
          </div>

          <div className="absolute left-6 top-2 z-10 space-y-2.5">
            <div className="bg-gray-900 px-3 py-1 rounded font-mono text-yellow-400 text-xs border-2 border-yellow-600">
              POP/ROCK DECADES
            </div>
            {decadeBins.map(bin => (
              <RecordBin 
                key={bin.label}
                albums={getBinAlbums('decade', bin.label)} 
                color={bin.color} 
                label={bin.label}
                onClick={() => {
                  setSelectedBin({ type: 'decade', value: bin.label, label: bin.label, color: bin.color });
                  setCurrentView('bin');
                  setCurrentIndex(0);
                }}
              />
            ))}
          </div>

          <div className="absolute right-6 top-2 z-10">
            <div className="bg-gray-900 px-3 py-1 rounded font-mono text-yellow-400 text-xs border-2 border-yellow-600 mb-2.5 text-center">
              GENRES
            </div>
            <div className="flex gap-3">
              {/* First column - 7 bins */}
              <div className="space-y-2.5 flex flex-col items-end">
                {genreBins.slice(0, 7).map(bin => (
                  <RecordBin 
                    key={bin.label}
                    albums={getBinAlbums('genre', bin.label)} 
                    color={bin.color} 
                    label={bin.label}
                    onClick={() => {
                      setSelectedBin({ type: 'genre', value: bin.label, label: bin.label, color: bin.color });
                      setCurrentView('bin');
                      setCurrentIndex(0);
                    }}
                  />
                ))}
              </div>
              {/* Second column - remaining bins */}
              <div className="space-y-2.5 flex flex-col items-end">
                {genreBins.slice(7).map(bin => (
                  <RecordBin 
                    key={bin.label}
                    albums={getBinAlbums('genre', bin.label)} 
                    color={bin.color} 
                    label={bin.label}
                    onClick={() => {
                      setSelectedBin({ type: 'genre', value: bin.label, label: bin.label, color: bin.color });
                      setCurrentView('bin');
                      setCurrentIndex(0);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 cursor-pointer hover:scale-105 transition-transform"
               onClick={() => setCurrentView('search')}>
            <div className="bg-gray-700 border-6 border-gray-900 rounded-lg p-3 shadow-2xl"
                 style={{ width: '180px', boxShadow: '6px 6px 0px rgba(0,0,0,0.5)' }}>
              <div className="bg-green-900 border-3 border-green-950 p-2 mb-2 font-mono text-green-400 text-center text-xs leading-relaxed">
                SEARCH<br/>ENTIRE<br/>COLLECTION
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-3 bg-gray-800 border-2 border-gray-950 rounded" />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 cursor-pointer hover:scale-105 transition-transform"
               style={{ marginLeft: '220px' }}
               onClick={() => setShowPlaylist(true)}>
            <div className="bg-green-700 border-6 border-green-900 rounded-lg p-3 shadow-2xl relative animate-pulse"
                 style={{ width: '150px', boxShadow: '6px 6px 0px rgba(0,0,0,0.5)' }}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white border-4 border-black rounded-full p-1 animate-bounce">
                <div className="text-xl">🎵</div>
              </div>
              <div className="bg-green-900 border-3 border-green-950 p-2 font-mono text-green-300 text-center text-xs leading-relaxed">
                HEY!<br/>LISTEN!<br/>🎮
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40"
               style={{ marginLeft: '-100px', transform: 'scale(0.8)' }}>
            <div className="relative" style={{ width: '48px', height: '70px' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2">
                <div className="w-8 h-5 bg-gray-800 rounded-t-full border-2 border-black" 
                     style={{ borderBottom: '2px solid #4b5563' }} />
                <div className="w-7 h-8 bg-pink-200 border-2 border-black mx-auto -mt-0.5">
                  <div className="flex justify-center gap-1.5 mt-2">
                    <div className="w-1 h-2 bg-black" />
                    <div className="w-1 h-2 bg-black" />
                  </div>
                  <div className="w-1 h-1 bg-pink-300 mx-auto mt-1" />
                </div>
                <div className="w-6 h-3 bg-amber-900 mx-auto -mt-1 border-2 border-black border-t-0"
                     style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
              </div>
              
              <div className="absolute top-16 left-1/2 -translate-x-1/2">
                <div className="w-10 h-12 bg-red-700 border-2 border-black relative">
                  <div className="absolute inset-y-0 left-2 w-0.5 bg-black opacity-30" />
                  <div className="absolute inset-y-0 left-5 w-0.5 bg-black opacity-30" />
                  <div className="absolute inset-y-0 right-2 w-0.5 bg-black opacity-30" />
                  <div className="absolute inset-x-0 top-3 h-0.5 bg-black opacity-30" />
                  <div className="absolute inset-x-0 top-6 h-0.5 bg-black opacity-30" />
                  <div className="absolute inset-x-0 top-9 h-0.5 bg-black opacity-30" />
                </div>
                
                <div className="absolute -left-2.5 top-1 w-3 h-8 bg-red-700 border-2 border-black" />
                <div className="absolute -right-2.5 top-1 w-3 h-8 bg-red-700 border-2 border-black" />
                
                <div className="absolute -left-2.5 top-8 w-3 h-2 bg-pink-200 border-2 border-black" />
                <div className="absolute -right-2.5 top-8 w-3 h-2 bg-pink-200 border-2 border-black" />
              </div>
              
              <div className="absolute top-28 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-4 h-14 bg-blue-900 border-2 border-black" />
                <div className="w-4 h-14 bg-blue-900 border-2 border-black" />
              </div>
              
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-5 h-3 bg-amber-900 border-2 border-black rounded-sm" />
                <div className="w-5 h-3 bg-amber-900 border-2 border-black rounded-sm" />
              </div>
              
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-2 bg-black opacity-20 rounded-full blur-sm" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'bin' && selectedBin) {
    const binAlbums = getBinAlbums(selectedBin.type, selectedBin.value);
    
    const filteredAndSortedAlbums = binAlbums
      .filter(album => {
        if (filterGenre !== 'all' && album.Genre !== filterGenre) return false;
        if (filterTier !== 'all' && album.Tier !== filterTier) return false;
        return true;
      })
      .sort((a, b) => {
        let aVal = a[sortColumn] || '';
        let bVal = b[sortColumn] || '';
        if (sortColumn === 'Year') {
          aVal = parseInt(aVal) || 0;
          bVal = parseInt(bVal) || 0;
        }
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0" 
             style={{ 
               background: 'linear-gradient(45deg, #b8c657 25%, transparent 25%), linear-gradient(-45deg, #b8c657 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #b8c657 75%), linear-gradient(-45deg, transparent 75%, #b8c657 75%)',
               backgroundSize: '40px 40px',
               backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
               backgroundColor: '#a0b050'
             }} />
        
        <div className="relative z-10 max-w-6xl mx-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => setCurrentView('home')}
                    className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-yellow-400 rounded font-mono border-4 border-black shadow-lg">
              ← BACK TO STORE
            </button>
            <h1 className="text-4xl font-bold text-yellow-400 font-mono border-8 border-black bg-gray-900 px-6 py-3 rounded shadow-lg" 
                style={{ textShadow: '2px 2px 0px #000' }}>
              {selectedBin.label}
            </h1>
            <div className="flex gap-2">
              <button onClick={() => setBinViewMode('bin')}
                      className={'px-4 py-3 rounded font-mono border-4 border-black shadow-lg ' + (binViewMode === 'bin' ? 'bg-yellow-400 text-black' : 'bg-gray-900 text-yellow-400')}>
                BIN
              </button>
              <button onClick={() => setBinViewMode('collection')}
                      className={'px-4 py-3 rounded font-mono border-4 border-black shadow-lg ' + (binViewMode === 'collection' ? 'bg-yellow-400 text-black' : 'bg-gray-900 text-yellow-400')}>
                GRID
              </button>
              <button onClick={() => setBinViewMode('list')}
                      className={'px-4 py-3 rounded font-mono border-4 border-black shadow-lg ' + (binViewMode === 'list' ? 'bg-yellow-400 text-black' : 'bg-gray-900 text-yellow-400')}>
                LIST
              </button>
            </div>
          </div>

          {binAlbums.length === 0 && (
            <div className="text-center py-20 font-mono text-xl text-yellow-400 bg-gray-900 border-8 border-black rounded p-8">
              No albums found in this bin!
            </div>
          )}

          {(binViewMode === 'collection' || binViewMode === 'list') && binAlbums.length > 0 && (
            <div className="mb-6 flex gap-4 items-center">
              <div className="flex gap-2 items-center">
                <label className="text-yellow-400 font-mono text-sm">Genre:</label>
                <select 
                  value={filterGenre} 
                  onChange={(e) => setFilterGenre(e.target.value)}
                  className="px-3 py-2 bg-gray-900 text-yellow-400 border-4 border-black rounded font-mono text-sm">
                  <option value="all">All Genres</option>
                  {[...new Set(binAlbums.map(a => a.Genre).filter(Boolean))].sort().map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 items-center">
                <label className="text-yellow-400 font-mono text-sm">Tier:</label>
                <select 
                  value={filterTier} 
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="px-3 py-2 bg-gray-900 text-yellow-400 border-4 border-black rounded font-mono text-sm">
                  <option value="all">All Tiers</option>
                  {tierBins.map(tier => (
                    <option key={tier.tier} value={tier.tier}>{tier.tier}</option>
                  ))}
                </select>
              </div>
              <div className="text-yellow-400 font-mono text-sm bg-gray-900 border-4 border-black rounded px-4 py-2">
                Showing {filteredAndSortedAlbums.length} of {binAlbums.length}
              </div>
            </div>
          )}

          {binViewMode === 'collection' && binAlbums.length > 0 && (
            <div className="grid grid-cols-6 gap-4">
              {filteredAndSortedAlbums.map((album, i) => {
                const albumImage = getAlbumImage(album);
                return (
                  <div key={i} onClick={() => setSelectedAlbum(album)}
                       className="relative aspect-square bg-gray-800 rounded cursor-pointer hover:scale-105 transition-transform flex items-center justify-center p-2 text-center text-xs border-4 border-black shadow-lg overflow-hidden">
                    {albumImage ? (
                      <img src={albumImage} alt={album.Album} className="absolute inset-0 w-full h-full object-cover" />
                    ) : null}
                    <div className="absolute top-1 right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 border-black"
                         style={{ backgroundColor: tierBins.find(t => t.tier === album.Tier)?.color || '#999' }}>
                      {album.Tier}
                    </div>
                    {!albumImage && (
                      <div>
                        <div className="font-bold text-yellow-400">{album.Artist}</div>
                        <div className="text-gray-400 text-xs mt-1">{album.Album}</div>
                      </div>
                    )}
                    {albumImage && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2">
                        <div className="font-bold text-yellow-400 text-xs truncate">{album.Artist}</div>
                        <div className="text-gray-400 text-xs truncate">{album.Album}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {binViewMode === 'list' && binAlbums.length > 0 && (
            <div>
              <div className="mb-4 flex gap-4 bg-gray-800 p-4 rounded-lg border-4 border-black">
                <div className="flex-1">
                  <label className="text-yellow-400 font-mono text-sm mb-2 block">Filter by Genre</label>
                  <select 
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                    className="w-full bg-gray-900 text-yellow-400 border-2 border-yellow-600 rounded px-3 py-2 font-mono">
                    <option value="all">All Genres</option>
                    {[...new Set(albums.map(a => a.Genre).filter(Boolean))].sort().map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-yellow-400 font-mono text-sm mb-2 block">Filter by Tier</label>
                  <select 
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value)}
                    className="w-full bg-gray-900 text-yellow-400 border-2 border-yellow-600 rounded px-3 py-2 font-mono">
                    <option value="all">All Tiers</option>
                    <option value="S">S</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => {
                      setFilterGenre('all');
                      setFilterTier('all');
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-mono px-4 py-2 rounded border-2 border-black">
                    Clear Filters
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg overflow-hidden border-4 border-black shadow-lg">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr className="font-mono text-sm text-yellow-400">
                      <th className="p-3 text-left border-b-4 border-black cursor-pointer hover:bg-gray-700"
                          onClick={() => {
                            if (sortColumn === 'Artist') {
                              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSortColumn('Artist');
                              setSortDirection('asc');
                            }
                          }}>
                        Artist {sortColumn === 'Artist' && (sortDirection === 'asc' ? '▲' : '▼')}
                      </th>
                      <th className="p-3 text-left border-b-4 border-black cursor-pointer hover:bg-gray-700"
                          onClick={() => {
                            if (sortColumn === 'Album') {
                              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSortColumn('Album');
                              setSortDirection('asc');
                            }
                          }}>
                        Album {sortColumn === 'Album' && (sortDirection === 'asc' ? '▲' : '▼')}
                      </th>
                      <th className="p-3 text-left border-b-4 border-black cursor-pointer hover:bg-gray-700"
                          onClick={() => {
                            if (sortColumn === 'Year') {
                              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSortColumn('Year');
                              setSortDirection('asc');
                            }
                          }}>
                        Year {sortColumn === 'Year' && (sortDirection === 'asc' ? '▲' : '▼')}
                      </th>
                      <th className="p-3 text-left border-b-4 border-black cursor-pointer hover:bg-gray-700"
                          onClick={() => {
                            if (sortColumn === 'Genre') {
                              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSortColumn('Genre');
                              setSortDirection('asc');
                            }
                          }}>
                        Genre {sortColumn === 'Genre' && (sortDirection === 'asc' ? '▲' : '▼')}
                      </th>
                      <th className="p-3 text-left border-b-4 border-black cursor-pointer hover:bg-gray-700"
                          onClick={() => {
                            if (sortColumn === 'Tier') {
                              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSortColumn('Tier');
                              setSortDirection('asc');
                            }
                          }}>
                        Tier {sortColumn === 'Tier' && (sortDirection === 'asc' ? '▲' : '▼')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-yellow-400">
                    {filteredAndSortedAlbums.map((album, i) => (
                      <tr key={i} onClick={() => setSelectedAlbum(album)}
                          className="border-t border-gray-800 hover:bg-gray-800 cursor-pointer">
                        <td className="p-3">{album.Artist}</td>
                        <td className="p-3">{album.Album}</td>
                        <td className="p-3">{album.Year}</td>
                        <td className="p-3">{album.Genre}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded font-bold text-black text-xs border-2 border-black"
                                style={{ backgroundColor: selectedBin.color }}>
                            {album.Tier}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {binViewMode === 'bin' && binAlbums.length > 0 && (
            <div className="relative flex items-center justify-center gap-8 mx-auto" style={{ maxWidth: '1200px' }}
                 onWheel={(e) => {
                   e.preventDefault();
                   
                   if (scrollTimeout) {
                     clearTimeout(scrollTimeout);
                   }
                   
                   const timeout = setTimeout(() => {
                     if (Math.abs(e.deltaY) > 5) {
                       const delta = e.deltaY > 0 ? 1 : -1;
                       setCurrentIndex(prev => Math.max(0, Math.min(binAlbums.length - 1, prev + delta)));
                     }
                   }, 200);
                   
                   setScrollTimeout(timeout);
                 }}>
              
              <div className="w-56 flex justify-center">
                <div className="bg-gray-900 border-4 border-black rounded-lg p-4 w-56 self-center" style={{ marginTop: '0' }}>
                <div className="text-center mb-3">
                  <p className="text-yellow-400 font-mono font-bold text-base mb-2">HOW TO NAVIGATE</p>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="bg-gray-800 border-2 border-yellow-600 rounded px-3 py-2 font-bold font-mono text-yellow-400 text-xl w-full">↑ ↓</div>
                    <span className="text-gray-300 font-mono text-xs">Arrow keys</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="bg-gray-800 border-2 border-yellow-600 rounded px-3 py-2 font-bold font-mono text-yellow-400 text-xl w-full">🖱️</div>
                    <span className="text-gray-300 font-mono text-xs">Mouse wheel</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="bg-gray-800 border-2 border-yellow-600 rounded px-3 py-2 font-bold font-mono text-yellow-400 text-xl w-full">📊</div>
                    <span className="text-gray-300 font-mono text-xs">Click scroll bar</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700 text-center">
                  <p className="text-gray-400 font-mono text-xs">Click the front record to view full details</p>
                </div>
              </div>
            </div>

              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative max-w-2xl mx-auto" style={{ height: '450px', width: '420px' }}>
                  {binAlbums.map((album, idx) => {
                    const offset = idx - currentIndex;
                    const isVisible = Math.abs(offset) <= 2;
                    
                    if (!isVisible) return null;
                    
                    const translateY = offset * 180; // Increased from 120 to 180 for more spacing
                    const opacity = 1 - Math.abs(offset) * 0.6; // Increased from 0.4 to 0.6 for more fade
                    const scale = 1 - Math.abs(offset) * 0.2; // Increased from 0.15 to 0.2 for more shrinking
                    const zIndex = 100 - Math.abs(offset);
                    const albumImage = getAlbumImage(album);
                    
                    return (
                      <div
                        key={idx}
                        className="absolute left-1/2 top-1/2 cursor-pointer transition-all duration-300 ease-out"
                        style={{
                          transform: 'translate(-50%, calc(-50% + ' + translateY + 'px)) scale(' + scale + ')',
                          opacity: opacity,
                          zIndex: zIndex,
                          width: '420px'
                        }}
                        onClick={() => offset === 0 && setSelectedAlbum(album)}>
                        <div className="relative bg-gray-800 rounded-lg p-4 border-8 border-black shadow-2xl overflow-hidden"
                             style={{ height: '420px' }}>
                          {albumImage && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <img src={albumImage} alt={album.Album} className="w-full h-full object-contain opacity-40" />
                            </div>
                          )}
                          <div className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 border-black"
                               style={{ backgroundColor: tierBins.find(t => t.tier === album.Tier)?.color || '#999' }}>
                            {album.Tier}
                          </div>
                          
                          <div className="relative flex flex-col items-center justify-center h-full text-center">
                            <div className="text-2xl font-bold text-yellow-400 mb-3 drop-shadow-lg">{album.Artist}</div>
                            <div className="text-lg text-gray-300 mb-3 drop-shadow-lg">{album.Album}</div>
                            <div className="text-base text-gray-400 drop-shadow-lg">{album.Year}</div>
                            {offset === 0 && (
                              <div className="mt-4 text-xs text-cyan-400 font-mono animate-pulse drop-shadow-lg">
                                ▼ CLICK TO VIEW DETAILS ▼
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 font-mono text-2xl text-yellow-400 bg-gray-900 border-4 border-black rounded px-6 py-3">
                  {currentIndex + 1} of {binAlbums.length}
                </div>
              </div>

              <div className="w-56 flex justify-center">
                <div className="flex flex-col items-center gap-2 self-center" style={{ marginTop: '0' }}>
                <div 
                  className="w-12 bg-gray-900 border-4 border-black rounded-lg overflow-hidden cursor-pointer hover:border-yellow-600 transition-colors" 
                  style={{ height: '450px' }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const percentage = y / rect.height;
                    const newIndex = Math.round(percentage * (binAlbums.length - 1));
                    setCurrentIndex(Math.max(0, Math.min(binAlbums.length - 1, newIndex)));
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const handleMouseMove = (moveEvent) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const y = moveEvent.clientY - rect.top;
                      const percentage = Math.max(0, Math.min(1, y / rect.height));
                      const newIndex = Math.round(percentage * (binAlbums.length - 1));
                      setCurrentIndex(Math.max(0, Math.min(binAlbums.length - 1, newIndex)));
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}>
                  <div className="relative h-full bg-gray-800">
                    <div 
                      className="absolute left-0 right-0 bg-yellow-400 rounded transition-all duration-100 pointer-events-none"
                      style={{
                        top: (currentIndex / Math.max(1, binAlbums.length - 1)) * 100 + '%',
                        height: Math.max(20, (100 / binAlbums.length)) + 'px'
                      }}
                    />
                    {binAlbums.map((_, idx) => {
                      if (idx % Math.ceil(binAlbums.length / 10) === 0) {
                        return (
                          <div 
                            key={idx}
                            className="absolute left-0 w-full h-0.5 bg-gray-700 pointer-events-none"
                            style={{ top: (idx / Math.max(1, binAlbums.length - 1)) * 100 + '%' }}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
                <div className="text-xs text-yellow-400 font-mono font-bold">SCROLL</div>
              </div>
            </div>
            </div>
          )}
        </div>

        {selectedAlbum && (
          <AlbumDetail album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
        )}
      </div>
    );
  }

  if (currentView === 'search') {
    const filteredAlbums = albums.filter(album => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = (
        album.Artist?.toLowerCase().includes(searchLower) ||
        album.Album?.toLowerCase().includes(searchLower) ||
        album.Genre?.toLowerCase().includes(searchLower) ||
        album.Year?.toLowerCase().includes(searchLower)
      );
      
      if (excludeTBD && album.Tier === 'TBD') {
        return false;
      }
      
      return matchesSearch;
    });

    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0" 
             style={{ 
               background: 'linear-gradient(45deg, #b8c657 25%, transparent 25%), linear-gradient(-45deg, #b8c657 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #b8c657 75%), linear-gradient(-45deg, transparent 75%, #b8c657 75%)',
               backgroundSize: '40px 40px',
               backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
               backgroundColor: '#a0b050'
             }} />
        
        <div className="relative z-10 max-w-6xl mx-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => setCurrentView('home')}
                    className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-yellow-400 rounded font-mono border-4 border-black shadow-lg">
              ← BACK TO STORE
            </button>
            <h1 className="text-4xl font-bold text-yellow-400 font-mono border-8 border-black bg-gray-900 px-6 py-3 rounded shadow-lg" 
                style={{ textShadow: '2px 2px 0px #000' }}>
              SEARCH COLLECTION
            </h1>
            <div className="w-48"></div>
          </div>

          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by artist, album, genre, or year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg bg-gray-900 text-yellow-400 border-4 border-black rounded-lg font-mono focus:outline-none focus:border-yellow-400"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400" size={24} />
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="text-yellow-400 font-mono text-sm bg-gray-900 border-4 border-black rounded px-4 py-2 inline-block">
                Found {filteredAlbums.length} albums
              </div>
              <label className="flex items-center gap-2 text-yellow-400 font-mono text-sm bg-gray-900 border-4 border-black rounded px-4 py-2 cursor-pointer hover:bg-gray-800">
                <input
                  type="checkbox"
                  checked={excludeTBD}
                  onChange={(e) => setExcludeTBD(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                Exclude TBD
              </label>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-4">
            {filteredAlbums.map((album, i) => {
              const albumImage = getAlbumImage(album);
              return (
                <div key={i} onClick={() => setSelectedAlbum(album)}
                     className="relative aspect-square bg-gray-800 rounded cursor-pointer hover:scale-105 transition-transform flex items-center justify-center p-2 text-center text-xs border-4 border-black shadow-lg overflow-hidden">
                  {albumImage ? (
                    <img src={albumImage} alt={album.Album} className="absolute inset-0 w-full h-full object-cover" />
                  ) : null}
                  <div className="absolute top-1 right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 border-black"
                       style={{ backgroundColor: tierBins.find(t => t.tier === album.Tier)?.color || '#999' }}>
                    {album.Tier}
                  </div>
                  {!albumImage && (
                    <div>
                      <div className="font-bold text-yellow-400">{album.Artist}</div>
                      <div className="text-gray-400 text-xs mt-1">{album.Album}</div>
                    </div>
                  )}
                  {albumImage && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2">
                      <div className="font-bold text-yellow-400 text-xs truncate">{album.Artist}</div>
                      <div className="text-gray-400 text-xs truncate">{album.Album}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredAlbums.length === 0 && searchQuery && (
            <div className="text-center py-20 font-mono text-xl text-yellow-400 bg-gray-900 border-8 border-black rounded p-8">
              No albums found matching "{searchQuery}"
            </div>
          )}
        </div>

        {selectedAlbum && (
          <AlbumDetail album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
        )}
      </div>
    );
  }

  return null;
};

export default VinylVault;
