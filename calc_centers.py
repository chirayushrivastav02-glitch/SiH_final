import json
import re

data = json.load(open('C:/Users/Vaibh/OneDrive/Documents/SiH_final/frontend/src/data/indiaMapSvgData.json'))

# Manual precise SVG center coordinates for India states on viewBox="0 0 612 696"
state_centers = {
  'jk': { 'x': 190, 'y': 100, 'name': 'Jammu and Kashmir' },
  'hp': { 'x': 230, 'y': 140, 'name': 'Himachal Pradesh' },
  'pb': { 'x': 200, 'y': 160, 'name': 'Punjab' },
  'hr': { 'x': 210, 'y': 190, 'name': 'Haryana' },
  'dl': { 'x': 225, 'y': 200, 'name': 'Delhi' },
  'ut': { 'x': 260, 'y': 170, 'name': 'Uttarakhand' },
  'rj': { 'x': 150, 'y': 250, 'name': 'Rajasthan' },
  'up': { 'x': 300, 'y': 240, 'name': 'Uttar Pradesh' },
  'br': { 'x': 420, 'y': 270, 'name': 'Bihar' },
  'sk': { 'x': 455, 'y': 200, 'name': 'Sikkim' },
  'wb': { 'x': 440, 'y': 340, 'name': 'West Bengal' },
  'jh': { 'x': 400, 'y': 320, 'name': 'Jharkhand' },
  'or': { 'x': 380, 'y': 380, 'name': 'Odisha' },
  'ct': { 'x': 320, 'y': 340, 'name': 'Chhattisgarh' },
  'mp': { 'x': 240, 'y': 310, 'name': 'Madhya Pradesh' },
  'gj': { 'x': 110, 'y': 310, 'name': 'Gujarat' },
  'mh': { 'x': 190, 'y': 400, 'name': 'Maharashtra' },
  'tg': { 'x': 260, 'y': 430, 'name': 'Telangana' },
  'ap': { 'x': 270, 'y': 490, 'name': 'Andhra Pradesh' },
  'ka': { 'x': 200, 'y': 510, 'name': 'Karnataka' },
  'ga': { 'x': 160, 'y': 490, 'name': 'Goa' },
  'kl': { 'x': 210, 'y': 600, 'name': 'Kerala' },
  'tn': { 'x': 245, 'y': 590, 'name': 'Tamil Nadu' },
  'as': { 'x': 530, 'y': 230, 'name': 'Assam' },
  'ar': { 'x': 570, 'y': 180, 'name': 'Arunachal Pradesh' },
  'ml': { 'x': 510, 'y': 250, 'name': 'Meghalaya' },
  'nl': { 'x': 575, 'y': 230, 'name': 'Nagaland' },
  'mn': { 'x': 570, 'y': 260, 'name': 'Manipur' },
  'mz': { 'x': 555, 'y': 295, 'name': 'Mizoram' },
  'tr': { 'x': 530, 'y': 285, 'name': 'Tripura' }
}

f = open('C:/Users/Vaibh/OneDrive/Documents/SiH_final/frontend/src/data/indiaStateCenters.json', 'w')
json.dump(state_centers, f, indent=2)
f.close()
print("Saved 30 state centers!")
