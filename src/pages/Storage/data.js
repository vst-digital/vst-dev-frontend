import { useState, useEffect, useHttp } from "react";
import {getUserStorages, postUserStorage, putUserStorage, deleteUserStorage} from "shared/services"


export const Data = ({ history }) => {
  const [fileItems, setFileItems] = useState();
  const { notify, requestHandler } = useHttp();

  useEffect(() => {
    setTimeout(() => new Promise(async (resolve) =>{
        try {
          const limit = 50
          const per_page = limit;
          const page_no = 1;
          const filter = {};
          const sort = '';
          const res = await requestHandler(getUserStorages({ per_page, page_no, sort, filter }));
          const data = res.data;
          const count = res.meta.pagination.count;
          resolve(setFileItems(data));
        } catch (e) {
            console.error(e);
            setFileItems({ data: [], count: 0 });
            resolve({ data: [], count: 0 });
        }
    }), 1000)
  }, []);
  
  return (<>fileItems</>)
}

export const fileItems = [
//   {
//    name: 'My Files',
//    isDirectory: true,
//    __KEY__: '',
//    items: [{
//     name: 'Projects',
//     isDirectory: true,

//     items: [{
//       name: 'About.rtf',
//       isDirectory: false,
//       size: 1024,
//     }, {
//       name: 'Passwords.rtf',
//       isDirectory: false,
//       size: 2048,
//     }],
//   }, {
//     name: 'About.xml',
//     isDirectory: false,
//     size: 1024,
//   }, {
//     name: 'Managers.rtf',
//     isDirectory: false,
//     size: 2048,
//   }, {
//     name: 'ToDo.txt',
//     isDirectory: false,
//     size: 3072,
//   }],
// }, 
      {
          "id": 11,
          "user_storage_id": 2,
          "project_id": 1,
          "name": "first",
          "isDirectory": true,
          "size": 0,
          "parent_id": null,
          "__KEY__": 1653724018856
      },
      {
          "id": 12,
          "user_storage_id": 2,
          "project_id": 1,
          "name": "second",
          "isDirectory": true,
          "size": 0,
          "parent_id": null,
          "__KEY__": 1653724039538
      }
];
