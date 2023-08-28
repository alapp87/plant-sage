export function uriToBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // If successful -> return with blob
    xhr.onload = function () {
      resolve(xhr.response);
    };

    // reject on error
    xhr.onerror = function () {
      reject(new Error("uriToBlob failed"));
    };

    // Set the response type to 'blob' - this means the server's response
    // will be accessed as a binary object
    xhr.responseType = "blob";

    // Initialize the request. The third argument set to 'true' denotes
    // that the request is asynchronous
    xhr.open("GET", uri, true);

    // Send the request. The 'null' argument means that no body content is given for the request
    xhr.send(null);
  });
}

export function identifyPlantByImage(imageUri: string): Promise<object> {
  return new Promise((resolve, reject) => {
    console.log(`Identifying plant by image :: ${imageUri}`);

    try {
      // const blob = uriToBlob(selectedImage);
      // console.log(`Image data = ${blob}`);

      const apiUrl =
        "https://plant-sage-api-dot-nth-passage-113523.appspot.com/identify";
      let uriParts = imageUri.split(".");
      let fileType = uriParts.at(-1);

      let formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      let options = {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      };

      fetch(apiUrl, options)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(`data = ${JSON.stringify(data)}`);
          resolve(data);
        })
        .catch((reason) => {
          reject(reason);
        });
      // const data = {
      //   plant_species: [
      //     {
      //       name: "Epipremnum aureum",
      //       probability: 0.99938154,
      //     },
      //     {
      //       name: "Test 02",
      //       probability: 0.98938154,
      //     },
      //     {
      //       name: "Test 03",
      //       probability: 0.54001,
      //     },
      //   ],
      // };
      // console.log(`data = ${JSON.stringify(data)}`);
      // setTimeout(() => resolve(data), 4000);
    } catch (error) {
      console.error("An error occurred identifying plant by image ::", error);
      reject(error);
    }
  });
}

export function generateInfoAndCareRoutine(
  plantSpecies: string
): Promise<object> {
  return new Promise((resolve, reject) => {
    console.log(`Generating info and care routine :: ${plantSpecies}`);

    try {
      const encodedPlantSpecies = encodeURIComponent(plantSpecies);
      const apiUrl = `https://plant-sage-api-dot-nth-passage-113523.appspot.com/generate/info/care?plant_species=${encodedPlantSpecies}`;

      let options = {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      };

      fetch(apiUrl, options)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(`data = ${JSON.stringify(data)}`);
          resolve(data);
        })
        .catch((reason) => {
          console.log(reason);
          reject(reason);
        });
      // setTimeout(
      //   () =>
      //     resolve({
      //       info: "Epipremnum aureum, commonly known as Pothos or Devil's Ivy, is a popular houseplant due to its attractive trailing vines and ability to tolerate a wide range of growing conditions. It is native to the Solomon Islands and can be found in tropical and subtropical regions. Pothos is a vining plant that can grow both indoors and outdoors, making it ideal for hanging baskets or to be trained on supports.",
      //       care_routine: {
      //         light:
      //           "Pothos prefers bright, indirect light but can also tolerate low light conditions. Avoid direct sunlight as it can scorch the leaves.",
      //         water:
      //           "Water your Pothos when the top 1-2 inches of soil is dry. Be careful not to overwater as it can lead to root rot. Pothos can tolerate dry spells better than being constantly wet.",
      //         temperature:
      //           "Pothos thrives in temperatures between 60-85°F (15-29°C). Protect it from cold drafts and avoid placing it near heating or cooling vents.",
      //         humidity:
      //           "Pothos can adapt to a wide range of humidity levels, but it prefers moderate to high humidity. Regular misting or placing the plant on a tray filled with water and pebbles can increase humidity.",
      //         fertilizer:
      //           "Feed your Pothos with a balanced liquid houseplant fertilizer once a month during the growing season (spring and summer). Follow the package instructions for dosage.",
      //         propagation:
      //           "Pothos can be easily propagated through stem cuttings. Simply cut a 4-6 inch section of stem below a node, remove the lower leaves, and place the cutting in water or well-draining soil. Roots will form in a few weeks.",
      //         pruning:
      //           "Pruning is not necessary for Pothos, but it can be done to control its size and shape. Trim off any leggy or yellowing vines to encourage bushier growth.",
      //         toxicity:
      //           "Pothos is toxic to pets and humans if ingested. Keep it out of reach from children and pets who may chew on the leaves.",
      //       },
      //     }),
      //   5000
      // );
    } catch (error) {
      console.error("An error occurred identifying plant by image ::", error);
      reject(error);
    }
  });
}
