import urllib.request
import json
import math

url = 'https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson'
print("Fetching official GeoJSON data for 594 districts of India...")
req = urllib.request.urlopen(url)
geojson = json.loads(req.read().decode('utf-8'))

# Mercator projection bounds for India on viewBox="0 0 612 696"
min_lon, max_lon = 68.0, 97.5
min_lat, max_lat = 6.5, 37.2

def project(lon, lat):
    x = (lon - min_lon) / (max_lon - min_lon) * 510.0 + 50.0
    # Reverse Y for SVG coordinates
    y = (max_lat - lat) / (max_lat - min_lat) * 590.0 + 50.0
    return round(x, 1), round(y, 1)

def ring_to_svg_path(ring):
    path_cmds = []
    for i, pt in enumerate(ring):
        lon, lat = pt[0], pt[1]
        px, py = project(lon, lat)
        cmd = 'M' if i == 0 else 'L'
        path_cmds.append(f"{cmd} {px} {py}")
    path_cmds.append("Z")
    return " ".join(path_cmds)

districts_list = []
district_centers = {}

for feat in geojson['features']:
    props = feat['properties']
    state_name = props.get('NAME_1', '')
    district_name = props.get('NAME_2', '')
    dist_id = f"{state_name}-{district_name}".lower().replace(' ', '-')

    geom = feat['geometry']
    geom_type = geom['type']
    coords = geom['coordinates']

    path_str_parts = []
    all_lons, all_lats = [], []

    if geom_type == 'Polygon':
        for ring in coords:
            path_str_parts.append(ring_to_svg_path(ring))
            for pt in ring:
                all_lons.append(pt[0])
                all_lats.append(pt[1])
    elif geom_type == 'MultiPolygon':
        for poly in coords:
            for ring in poly:
                path_str_parts.append(ring_to_svg_path(ring))
                for pt in ring:
                    all_lons.append(pt[0])
                    all_lats.append(pt[1])

    if all_lons and all_lats:
        avg_lon = sum(all_lons) / len(all_lons)
        avg_lat = sum(all_lats) / len(all_lats)
        cx, cy = project(avg_lon, avg_lat)
        district_centers[dist_id] = {
            'state': state_name,
            'district': district_name,
            'x': cx,
            'y': cy
        }

    full_path = " ".join(path_str_parts)
    districts_list.append({
        'id': dist_id,
        'state': state_name,
        'district': district_name,
        'path': full_path
    })

output_data = {
    'viewBox': '0 0 612 696',
    'districts': districts_list,
    'centers': district_centers
}

out_file = 'C:/Users/Vaibh/OneDrive/Documents/SiH_final/frontend/src/data/indiaDistrictSvgData.json'
with open(out_file, 'w') as f:
    json.dump(output_data, f, indent=2)

print(f"Successfully exported {len(districts_list)} REAL administrative district boundary SVG paths to {out_file}!")
