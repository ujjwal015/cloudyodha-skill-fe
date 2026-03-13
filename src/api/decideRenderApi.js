import { API_ROOT } from "../config/constants/apiConstants/auth.js";
import { DECIDE_RENDER_API } from "../config/constants/apiConstants/superAdmin.js";
import { getRenderDecider } from "../redux/slicers/authSlice.js";
import api from "../utils/apiHelper.js";
import { errorToast } from "../utils/projectHelper.js";

export const decideRenderApi = (setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(DECIDE_RENDER_API)
    .success((a) => {
      setLoading && setLoading(false);
      if (a.statusCode == 200) {
        dispatch(getRenderDecider(a.details));
        
      }
    })
    .error((err) => {
      setLoading && setLoading(false);
      errorToast("Something went wrong")
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};
