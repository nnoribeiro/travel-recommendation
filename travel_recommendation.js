async function fetchRecommendations(searchString) {
	try {
		const response = await fetch('travel_recommendation_api.json');
		const data = await response.json();

        const countries = data.countries;
        const temples = data.temples;
        const beaches = data.beaches;

        switch(searchString.toLowerCase()) {
            case "country":
            case "countries":
                const joinedCountries = countries.reduce((accumulator, country) => {
                    return accumulator.concat(country.cities);
                }, []);
                return joinedCountries;
            case "temples":
            case "temple":
                return temples;
            case "beach":
            case "beaches":
                return beaches;
            default:
                const results = [];
                // search countries
                countries.forEach(country => {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(searchString.toLowerCase()) || city.description.toLowerCase().includes(searchString.toLowerCase())) {
                            results.push(city);
                        }
                    });
                })
                // Search in temples
                temples.forEach(temple => {
                    if (temple.name.toLowerCase().includes(searchString.toLowerCase()) ||temple.description.toLowerCase().includes(searchString.toLowerCase())) {
                        results.push(temple);
                    }
                });

                // Search in beaches
                beaches.forEach(beach => {
                    if (beach.name.toLowerCase().includes(searchString.toLowerCase()) ||beach.description.toLowerCase().includes(searchString.toLowerCase())) {
                        results.push(beach);
                    }
                });
                return results;
        }

		const result = data.countries.filter((item) => item.name.toLowerCase() == searchString.toLowerCase());

		return result;
	} catch (error) {
		console.error('Error fetching data', error);
		return [];
	}
}

function getCityTime(city) {
    let timezone = '';

    const timezones = {
        "Tokyo": "Asia/Tokyo",
        "Kyoto": "Asia/Tokyo",
        "Rio de Janeiro": "America/Sao_Paulo",
        "São Paulo": "America/Sao_Paulo",
        "Sydney": "Australia/Sydney",
        "Melbourne": "Australia/Melbourne",
        "Angkor Wat": "Asia/Phnom_Penh",
        "Taj Mahal": "Asia/Kolkata",
        "Bora Bora": "Pacific/Tahiti"
    }

    const options = { timeZone: timezones[city], hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const cityTime = new Date().toLocaleTimeString('en-US', options);
    return cityTime;
}

async function handleSearch() {
	const userInput = document.getElementById('search-input').value.trim();
	const resultContainer = document.getElementById('recommendations');

	resultContainer.innerHTML = '';

	if (userInput !== '') {
		try {
			const filteredData = await fetchRecommendations(userInput);

			if (filteredData.length > 0) {
				const resultsList = document.createElement('ul');
				filteredData.forEach((item) => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    const image = document.createElement('img');
                    image.src = item.imageUrl;
                    image.alt = item.name;
                    card.appendChild(image);

                    const description = document.createElement('div');
                    description.classList.add('description');
                    description.textContent = item.description;
                    card.appendChild(description);

                    const city = item.name.split(', ')[0];
                    const countryTime = getCityTime(city);

                    const countryTimeElem = document.createElement('span');
                    countryTimeElem.classList.add('country-time');
                    countryTimeElem.textContent = `Local time: ${countryTime}`;
                    card.appendChild(countryTimeElem);
 
                    resultContainer.appendChild(card);
				});
				resultContainer.appendChild(resultsList);
			} else {
				resultContainer.textContent = 'No recommendations found.';
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}
}


function clearRecommendations () {
    const userInput = document.getElementById('search-input');
    userInput.value = '';
    const resultContainer = document.getElementById('recommendations');
	resultContainer.innerHTML = '';
}