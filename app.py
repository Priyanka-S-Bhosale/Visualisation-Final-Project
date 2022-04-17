import json

from flask import *
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

df = pd.read_csv('data/project_dataset.csv')
rate_filter = ['State', 'Year', 'Population', 'Rates-Burglary', 'Rates-Larceny', 'Rates-Motor', 'Rates-Assault',
               'Rates-Murder',
               'Rates-Rape', 'Rates-Robbery']
main_rate_data = df[rate_filter]
print(main_rate_data)

total_value_filter = ['State', 'Year', 'Population', 'Total-All', 'Total-Burglary', 'Total-Larceny', 'Totals-Motor',
                      'Total-Assault', 'Total-Murder',
                      'Total-Rape', 'Total-Robbery']
total_value_data = df[total_value_filter]
print(total_value_data)

pcp_filter = ['State', 'Year', 'Total-Burglary', 'Total-Larceny', 'Totals-Motor',
              'Total-Assault', 'Total-Murder',
              'Total-Rape', 'Total-Robbery']
pcp_data = df[pcp_filter]
print(pcp_data)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/load_us_map', methods=["POST"])
def load_map():
    response = request.get_json()
    try:
        data = total_value_data[total_value_data['Year'] == int(response['Year'])].groupby('State')[
            response['Crime']].mean()
    except:
        data = total_value_data.groupby('State')[response['Crime']].mean()
    data = data.reset_index()
    data.to_dict()
    data = data.to_json()
    return jsonify(data)


@app.route('/parallel_coordinates_plot', methods=["POST"])
def load_pcp():
    result = request.get_json()
    print(result['State'])
    state_data = total_value_data[total_value_data['State'] == result['State']]
    columns = ["Year", "Total-Burglary", "Total-Larceny", "Totals-Motor",
               "Total-Assault", "Total-Murder",
               "Total-Rape", "Total-Robbery"]
    state_data = state_data[["Year", "Total-Burglary", "Total-Larceny", "Totals-Motor",
                             "Total-Assault", "Total-Murder",
                             "Total-Rape", "Total-Robbery"]]
    scaled_data = StandardScaler().fit_transform(state_data)
    scaled_df = pd.DataFrame(scaled_data, index=state_data.index, columns=columns)
    print(scaled_df)

    data = []
    dimensions = ['Year', 'Total-Burglary', 'Total-Larceny', 'Totals-Motor',
                  'Total-Assault', 'Total-Murder',
                  'Total-Rape', 'Total-Robbery']
    data.append(scaled_df.to_dict(orient='records'))
    data.append(dimensions)

    kmeans = KMeans(n_clusters=3, random_state=0).fit(scaled_df)
    kMeansLabels = kmeans.labels_
    data.append(kMeansLabels.flatten().tolist())
    print(data)
    return json.dumps(data)


@app.route('/bar_chart', methods=["POST"])
def load_bar_chart():
    response = request.get_json()
    print(response['State'])
    print(response['Crime'])
    state_crime_data = total_value_data[total_value_data['State'] == response['State']]
    state_crime_data = state_crime_data[[response['Crime'], "Year"]]
    data = state_crime_data.reset_index()
    data.to_dict()
    data = data.to_json()
    return data


@app.route('/pie_chart', methods=["POST"])
def load_pie_chart():
    return "data"


if __name__ == '__main__':
    app.run(debug=True)
