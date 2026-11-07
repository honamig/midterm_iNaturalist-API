async function getPlaces(searchTerm) {
  const url = `https://api.inaturalist.org/v1/places/autocomplete?q=${searchTerm}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    const placeResults = document.querySelector("#place-results");

    placeResults.innerHTML = '<option value="">Select a place</option>';

    data.results.forEach((place) => {
      const option = document.createElement("option");

      option.value = place.id;
      option.textContent = place.display_name;

      placeResults.appendChild(option);
    });
  } catch (error) {
    console.error(error.message);
  }
}

const identificationResults = document.querySelector("#identification-results");

async function getIdentifications(placeId) {
  identificationResults.innerHTML = "";
  const url = `https://api.inaturalist.org/v1/identifications?place_id=${placeId}&per_page=10`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    const identifications = data.results;

    identifications.forEach((identification) => {
      const observation = identification.observation;

      if (!observation || !observation.taxon) {
        return;
      }

      const taxon = observation.taxon;

      if (!taxon.default_photo) {
        return;
      }

      const name = taxon.preferred_common_name || taxon.name;
      const image = taxon.default_photo.medium_url;

      if (!name || !image) {
        return;
      }

      const card = document.createElement("div");

      const nameElement = document.createElement("h3");
      nameElement.textContent = name;

      const imageElement = document.createElement("img");
      imageElement.src = image;
      imageElement.alt = name;

      card.appendChild(imageElement);
      card.appendChild(nameElement);

      identificationResults.appendChild(card);
    });
  } catch (error) {
    console.error(error.message);
  }
}

const searchForm = document.querySelector("#search-form");
const placeInput = document.querySelector("#place-input");
const placeResults = document.querySelector("#place-results");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchTerm = placeInput.value;

  getPlaces(searchTerm);
});

placeResults.addEventListener("change", () => {
  const placeId = placeResults.value;

  if (placeId) {
    getIdentifications(placeId);
  }
});
