// import React from "react";

// import { FaRegCircle, FaRegCheckCircle } from "react-icons/fa";

// export const ShowInputsState = (data) => {
//   //   console.log(data[0].inputValue);
//   return Object.keys(data).map(
//     (key) => {
//       console.log(data[key].data.inputValue);
//       console.log(data);
//       // eslint-disable-next-line
//       return data[key]?.length && data[key].inputValue == "empty" ? (
//         // data[key].inputValue === "Done" ? (
//         <h3>
//           <FaRegCheckCircle
//             color="#873e23"
//             className={data[key].id}
//             value={data[key].inputValue}
//           />
//         </h3>
//       ) : (
//         <h3>
//           <FaRegCircle
//             color="#873e23"
//             className={data[key].id}
//             value={data[key].inputValue}
//           />
//         </h3>
//       );
//     }
//     // data[key].map((index) => (
//     //   <h3>
//     //     {console.log(index.value)}
//     //     {console.log(index)}
//     //     <FaRegCircle color="#873e23" className={key} value={index} />
//     //   </h3>
//     // ))
//   );
// };

// // console.log(ShowInputsState);
// // {data.id === 1 && data.inputValue === "empty" && (
// //         <h3>
// //           <FaRegCircle color="#873e23" />
// //         </h3>
// //       )}
// //       {data.id === 1 && data.inputValue === "Done" && (
// //         <h3>
// //           <FaRegCheckCircle color="#873e23" />
// //         </h3>
// //       )}

// // export function ShowInputsState(data) {
// //   console.log("jsx", data.id, data.inputValue);
// //   console.log("data", data.data);
// //   //   data.map((dat) => <li>{dat.id}</li>);
// //   const a = data.map((dat) => (
// //     <h3>
// //       <FaRegCircle color="#873e23" id={dat} />
// //     </h3>
// //   ));
// //   //   return (
// //   //     <>
// //   //       {data.id === 1 && data.inputValue === "empty" && (
// //   //         <h3>
// //   //           <FaRegCircle color="#873e23" />
// //   //         </h3>
// //   //       )}
// //   //       {data.id === 1 && data.inputValue === "Done" && (
// //   //         <h3>
// //   //           <FaRegCheckCircle color="#873e23" />
// //   //         </h3>
// //   //       )}
// //   //       {data.id === 2 && data.inputValue === "empty" && (
// //   //         <h3>
// //   //           <FaRegCircle color="#873e23" />
// //   //         </h3>
// //   //       )}
// //   //       {data.id === 2 && data.inputValue === "Done" && (
// //   //         <h3>
// //   //           <FaRegCheckCircle color="#873e23" />
// //   //         </h3>
// //   //       )}
// //   //     </>
// //   //   );
// // }
