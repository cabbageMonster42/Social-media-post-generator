

const axios = require("axios");

async function generateImage(ctx) {
  const { inputText, imageWidth, imageHeight, imageType } = ctx.request.body;
  const prompt = `Masterpiece, Studio quality, (${inputText}), in the style (${imageType}):1.3`;
  const widthInt = parseInt(imageWidth, 10);
  const heightInt = parseInt(imageHeight, 10);
  if (isNaN(widthInt) || isNaN(heightInt)) {
    console.log("Invalid width or height value provided");
  } else {
    try {
      const response = await axios.post(
        "https://api.runpod.ai/v1/stable-diffusion-v1/run",
        {
          input: {
            width: widthInt,
            height: heightInt,
            negative_prompt: "bad quality, low resolution, cropped, vignette, ugly, bad, out of frame, no text, no markup, no logo, disfigured, mutilated",
            num_inference_steps: 80,
            prompt: prompt,
            width: widthInt,
            height: heightInt,
          },
        },
        {
          headers: {
            Authorization: "Bearer 6G9OKPCWH2ORIO27FJXFM7I1O6T6941GIDKMPAFL",
            "Content-Type": "application/json",
          },
        }
      );

      const jobId = response.data.id;

      // Check the status endpoint until job is completed
      let jobResponse = await axios.get(
        `https://api.runpod.ai/v1/stable-diffusion-v1/status/${jobId}`,
        {
          headers: {
            Authorization: "Bearer 6G9OKPCWH2ORIO27FJXFM7I1O6T6941GIDKMPAFL",
            "Content-Type": "application/json",
          },
        }
      );

      try {
        while (jobResponse.data.status === "IN_PROGRESS") {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          jobResponse = await axios.get(
            `https://api.runpod.ai/v1/stable-diffusion-v1/status/${jobId}`,
            {
              headers: {
                Authorization: "Bearer 6G9OKPCWH2ORIO27FJXFM7I1O6T6941GIDKMPAFL",
                "Content-Type": "application/json",
              },
            }
          );
        }
      } catch (error) {
        console.error("Error checking job status:", error.message, error.response && error.response.data);
        ctx.status = 500;
        ctx.body = {
          success: false,
          message: "Error checking job status: " + error.message,
        };
        return;
      }

      if (jobResponse.data.status === "COMPLETED") {
        const imageUrl = jobResponse.data.output[0].image;
        ctx.status = 200;
        ctx.body = {
          success: true,
          data: imageUrl,
        };
      } else {
        console.error("Unexpected job status:", jobResponse.data.status, jobResponse.data);
        ctx.status = 500;
        ctx.body = {
          success: false,
          message: "Error retrieving image.",
        };
      }
    } catch (error) {
      console.error("Error initiating Runpod request:", error.message, error.response && error.response.data);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message + "Error at Runpod",
      };
    }
  }
}

module.exports = {
  generateImage,
};



//WORKING MODE:

// const axios = require("axios");




// async function generateImage(ctx) {

//         // Continue processing with the valid integer values
      
//     const { inputText, imageWidth,  imageHeight, imageType } = ctx.request.body;
//     const prompt = `Masterpiece, Studio quality, (${inputText}), in the style (${imageType}):1.3`;
//     const widthInt = parseInt(imageWidth, 10);
//     const heightInt = parseInt(imageHeight, 10);
//     if (isNaN(widthInt) || isNaN(heightInt)) {
//         console.log("Invalid width or height value provided");
//       } else {


//     try {
//       const response = await axios.post(
//         "https://api.runpod.ai/v1/stable-diffusion-v1/run",
//         {
//           input: {
//             width: widthInt,
//             height: heightInt,
//             negative_prompt: "bad quality, low resolution, cropped, vignette, ugly, bad, out of frame, no text, no markup, no logo, disfigured, mutilated",
//             num_inference_steps: 80,
//             prompt: prompt,
//             width: widthInt,
//             height: heightInt,
//           },
//         },
//         {
//           headers: {
//             Authorization: "Bearer 6G9OKPCWH2ORIO27FJXFM7I1O6T6941GIDKMPAFL",
//             "Content-Type": "application/json",
//           },
//         }
//       );
  
//       const jobId = response.data.id;
  
//       // Check the status endpoint until job is completed
//       let jobResponse = await axios.get(
//         `https://api.runpod.ai/v1/stable-diffusion-v1/status/${jobId}`,
//         {
//           headers: {
//             Authorization: "Bearer 6G9OKPCWH2ORIO27FJXFM7I1O6T6941GIDKMPAFL",
//             "Content-Type": "application/json",
//           },
//         }
//       );
  
//       // while (jobResponse.data.status === "IN_PROGRESS") {
//       //   await new Promise((resolve) => setTimeout(resolve, 1000));
//       //   jobResponse = await axios.get(
//       //     `https://api.runpod.ai/v1/stable-diffusion-v1/status/${jobId}`,
//       //     {
//       //       headers: {
//       //         Authorization: "Bearer 6G9OKPCWH2ORIO27FJXFM7I1O6T6941GIDKMPAFL",
//       //         "Content-Type": "application/json",
//       //       },
//       //     }
//       //   );
//       // }
//       try {
//         while (jobResponse.data.status === "IN_PROGRESS") {
//           await new Promise((resolve) => setTimeout(resolve, 1000));
//           jobResponse = await axios.get(
//             `https://api.runpod.ai/v1/stable-diffusion-v1/status/${jobId}`,
//             {
//               headers: {
//                 Authorization: "Bearer 6G9OKPCWH2ORIO27FJXFM7I1O6T6941GIDKMPAFL",
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//         }
//       } catch (error) {
//         ctx.status = 500;
//         ctx.body = {
//           success: false,
//           message: "Error checking job status: " + error.message,
//         };
//         return;
//       }

//       if (jobResponse.data.status === "COMPLETED") {
//         const imageUrl = jobResponse.data.output[0].image;
//         ctx.status = 200;
//         ctx.body = {
//           success: true,
//           data: imageUrl,
//         };
//       } else {
//         ctx.status = 500;
//         ctx.body = {
//           success: false,
//           message: "Error retrieving image.",
//         };
//       }
//     } catch (error) {
//       ctx.status = 500;
//       ctx.body = {
//         success: false,
//         message: error.message + "Error at Runpod",
//       };
//     }
//   }
  

// };

//   module.exports = {
//   generateImage,
// };

