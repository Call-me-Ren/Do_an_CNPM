const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'public', 'mock', 'museum_data.json');
const raw = fs.readFileSync(dataFile, 'utf-8');
const data = JSON.parse(raw);

const imageMap = {
  'WRM001': '/images/artifacts/WRM001_tank.svg',
  'WRM002': '/images/artifacts/WRM002_f5a.svg',
  'WRM003': '/images/artifacts/WRM003_chinook.svg',
  'WRM004': '/images/artifacts/WRM004_uh1.svg',
  'WRM005': '/images/artifacts/WRM005_a37.svg',
  'WRM006': '/images/artifacts/WRM006_m107.svg',
  'WRM007': '/images/artifacts/WRM007_blu82.svg',
  'WRM008': '/images/artifacts/WRM008_cage.svg',
  'WRM009': '/images/artifacts/WRM009_guillotine.svg',
  'WRM010': '/images/artifacts/WRM010_napalm.svg',
  'WRM011': '/images/artifacts/WRM011_exec.svg',
  'WRM012': '/images/artifacts/WRM012_dioxin.svg',
  'WRM013': '/images/artifacts/WRM013_requiem.svg',
  'WRM014': '/images/artifacts/WRM014_medals.svg',
  'WRM015': '/images/artifacts/WRM015_peace.svg',
};

data.museum.banner = '/images/museum/war_remnants_museum_banner.svg';

data.artifacts.forEach(art => {
  if (imageMap[art.id]) {
    art.images = [imageMap[art.id]];
  }
});

fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
console.log('Successfully updated museum_data.json with 100% distinct images!');
