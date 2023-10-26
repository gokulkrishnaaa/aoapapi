import { importlocation } from "./import";

export {
  getProducts,
  addProduct,
  updateProduct,
  removeProduct,
  getProductByCode,
} from "./product";

export { getGender, addGender, updateGender, removeGender } from "./gender";
export {
  getSocialStatus,
  addSocialStatus,
  updateSocialStatus,
  removeSocialStatus,
} from "./socialstatus";
export {
  getInfoSource,
  addInfoSource,
  updateInfoSource,
  removeInfoSource,
} from "./infosource";
export { getStates, addState, removeState, updateState } from "./states";
export {
  getDistrictsFromState,
  addDistrict,
  updateDistrict,
  removeDistrict,
} from "./district";
export {
  getCities,
  getCityFromDistrict,
  getCityFromState,
  addCity,
  updateCity,
  removeCity,
} from "./city";
export {
  getCityForExam,
  getExamCityByState,
  addCityForEntrance,
  updateCityForEntrance,
  removeCityForEntrance,
} from "./examcity";
export { getCourses, addCourse, updateCourse, removeCourse } from "./course";
export { addCampus, getCampus, removeCampus, updateCampus } from "./campus";
export { createProgramme, getProgrammes, removeProgramme } from "./programme";
export {
  addProgrammeToEntrance,
  getProgrammesByEntrance,
  removeEntranceFromProgram,
} from "./entrance";
