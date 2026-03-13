import api from "../../utils/apiHelper.js";
import {
  devConsoleLog,
  errorToast,
  getLocal,
  successToast,
} from "../../utils/projectHelper";

import {
    SKILL_ASSESSMENT_BATCH_LIST_API,
    SKILL_ASSESSMENT_ALL_CANDIDATES_LIST_API,
    SKILL_ASSESSMENT_VIEW_CANDIDATES_LIST_API,
    SKILL_ASSESSMENT_RESULTS_LIST_API,
    SKILL_ASSESSMENT_RESULTS_VIEW_CANDIDATE_LIST_API,
    SKILL_ASSESSMENT_RESULTS_VIEW_MARKS_LIST_API,
    SKILL_ASSESSMENT_ACCESSOR_LIST_API,
    SKILL_ASSESSMENT_PARTNER_OPTIONS_LIST_API,
    SKILL_ASSESSMENT_RESULTS_JOBROLE_LIST_API,
    SKILL_ASSESSMENT_ACCESSOR_DETAILS_LIST_API,
} from "../../config/constants/apiConstants/superAdmin.js"

import { API_ROOT } from "../../config/constants/apiConstants/auth";
import {
    getAccessorList,
    getResultMarksViewList,
    getResultViewCandidateList,
    getResultList,
    getViewCandidateList,
    getAllCandidateList, 
    getBatchList,
    getPartnerList,
    getAccessorDetailsList,
    getJobRoleList,
} from "../../redux/slicers/superAdmin/skillAssessment.js";


export const batchListApi=(setLoading , page, search, limit, setTotalPages,setSortedData,partner_id)=>(dispatch)=>{
    let URL=
        search&&search!==""
        ?`${SKILL_ASSESSMENT_BATCH_LIST_API}?page=${page}&limit=${limit}&search=${search}`
        :`${SKILL_ASSESSMENT_BATCH_LIST_API}?page=${page}&limit=${limit}`;

    if(partner_id)URL+=`&partner_id=${partner_id}`;
    
    api()
    .root(API_ROOT)
    .get(URL)
    .success((a)=>{
        if(a?.statusCode===200){
            dispatch(getBatchList(a?.details?.batchDetails));
            setTotalPages(a?.details?.totalPages);
            setSortedData(a?.details?.batchDetails);
            setLoading && setLoading(false);

        }
    })
    .error((e)=>{
        setLoading && setLoading(false);
        devConsoleLog(e);
    })
    .send(()=>{})
}
export const partnerListApi=(setLoading , page, search, limit, setTotalPages,setFetchedPartner)=>(dispatch)=>{
    const URL=
        search&&search!==""
        ?`${SKILL_ASSESSMENT_PARTNER_OPTIONS_LIST_API}?page=${page}&limit=${limit}&search=${search}`
        :`${SKILL_ASSESSMENT_PARTNER_OPTIONS_LIST_API}`;
    api()
    .root(API_ROOT)
    .get(URL)
    .success((a)=>{
        if(a?.statusCode===200){
            setLoading && setLoading(false);
            dispatch(getPartnerList(a?.details));
            setFetchedPartner(a?.details);
        }
    })
    .error((e)=>{
        setLoading && setLoading(false);
        devConsoleLog(e);
    })
    .send(()=>{
        setLoading && setLoading(false);
    })
}

export const viewCandidateListApi=(setLoading,page,search,limit,setTotalPages,setSortedData,batch_id)=>(dispatch)=>{
    const URL=
        search&&search!==""
        ?`${SKILL_ASSESSMENT_VIEW_CANDIDATES_LIST_API}?batch_id=${batch_id}&page=${page}&limit=${limit}&search=${search}`
        :`${SKILL_ASSESSMENT_VIEW_CANDIDATES_LIST_API}?batch_id=${batch_id}&page=${page}&limit=${limit}`;
    api()
    .root(API_ROOT)
    .get(URL)
    .success((a)=>{
        if(a?.statusCode===200){
        setLoading && setLoading(false);
            if(batch_id){
                dispatch(getViewCandidateList(a?.details?.candidateDetails))
                setTotalPages(a?.details?.totalPages);
                setSortedData(a?.details?.candidateDetails);
            }
           
        }
    })
    .error((e)=>{
        setLoading && setLoading(false);
        devConsoleLog(e);
    })
    .send(()=>{
        setLoading && setLoading(false);
    })
}

export const allCandidateListApi=(setLoading,page,search,limit,setTotalPages,setSortedData)=>(dispatch)=>{
    const URL=
        search&&search!==""
        ?`${SKILL_ASSESSMENT_ALL_CANDIDATES_LIST_API}?page=${page}&limit=${limit}&search=${search}`
        :`${SKILL_ASSESSMENT_ALL_CANDIDATES_LIST_API}?page=${page}&limit=${limit}`;
    api()
    .root(API_ROOT)
    .get(URL)
    .success((a)=>{
        if(a?.statusCode===200){
            setLoading && setLoading(false);
            dispatch(getAllCandidateList(a?.details?.candidateDetails))
            setTotalPages(a?.details?.totalPages);
            setSortedData(a?.details?.candidateDetails);
        }
    })
    .error((e)=>{
        setLoading && setLoading(false);
        devConsoleLog(e);
    })
    .send(()=>{
        setLoading && setLoading(false);
    })
}
export const assessorsListApi=(setLoading,page,search,limit,setTotalPages,setSortedData)=>(dispatch)=>{
    const URL=
        search&&search!==""
        ?`${SKILL_ASSESSMENT_ACCESSOR_LIST_API}?page=${page}&limit=${limit}&search=${search}`
        :`${SKILL_ASSESSMENT_ACCESSOR_LIST_API}?page=${page}&limit=${limit}`;
    api()
    .root(API_ROOT)
    .get(URL)
    .success((a)=>{
        if(a?.statusCode===200){
            setLoading && setLoading(false);
            dispatch(getAccessorList(a?.details?.assesorDetails))
            setTotalPages(a?.details?.totalPages);
            setSortedData(a?.details?.assesorDetails);
        }
        setLoading(false);
    })
    .error((e)=>{
        setLoading && setLoading(false);
        devConsoleLog(e);
    })
    .send(()=>{
        setLoading && setLoading(false);
    })
}

export const assessorsDetailsListApi=(setLoading ,setSortedData,id)=>(dispatch)=>{
    const URL=`${SKILL_ASSESSMENT_ACCESSOR_DETAILS_LIST_API}/${id}`;
    api()
    .root(API_ROOT)
    .get(URL)
    .success((a)=>{
        if(a?.statusCode===200){
        setLoading && setLoading(false);
            if(id){
                dispatch(getAccessorDetailsList(a?.details));
                setSortedData(a?.details);
                }
            }
        }
    )
    .error((e)=>{
        setLoading && setLoading(false);
        devConsoleLog(e);
    })
    .send(()=>{
        setLoading && setLoading(false);
    })
}

export const resultListApi=(setLoading , page, search, limit, setTotalPages,setSortedData)=>(dispatch)=>{
    let URL=
        search&&search!==""
        ?`${SKILL_ASSESSMENT_RESULTS_LIST_API}?page=${page}&limit=${limit}&search=${search}`
        :`${SKILL_ASSESSMENT_RESULTS_LIST_API}?page=${page}&limit=${limit}`;
    api()
    .root(API_ROOT)
    .get(URL)
    .success((a)=>{
        if(a?.statusCode===200){
            dispatch(getResultList(a?.details?.batchDetails));
            setTotalPages(a?.details?.totalPages);
            setSortedData(a?.details?.batchDetails);
            setLoading && setLoading(false);
        }
    })
    .error((e)=>{
        setLoading && setLoading(false);
        devConsoleLog(e);
    })
    .send(()=>{
        setLoading && setLoading(false);
    })
}
export const resultViewApi=(setLoading , page, search, limit, setTotalPages,setSortedData,batch_id)=>(dispatch)=>{
    const URL=
        search&&search!==""
        ?`${SKILL_ASSESSMENT_RESULTS_VIEW_CANDIDATE_LIST_API}?batch_id=${batch_id}&page=${page}&limit=${limit}&search=${search}`
        :`${SKILL_ASSESSMENT_RESULTS_VIEW_CANDIDATE_LIST_API}?batch_id=Demo-batch01&page=${page}&limit=${limit}`;
    api()
    .root(API_ROOT)
    .get(URL)
    .success((a)=>{
        if(a?.statusCode===200){
            dispatch(getResultViewCandidateList(a?.details?.resultDetails));
            setTotalPages(a?.details?.totalPages);
            setSortedData(a?.details?.resultDetails);
            setLoading && setLoading(false);
        }
    })
    .error((e)=>{
        setLoading && setLoading(false);
        devConsoleLog(e);
    })
    .send(()=>{
        setLoading && setLoading(false);
    })
}
export const resultMarksViewtApi=(setLoading , page, search, limit, setTotalPages,setSortedData,id)=>(dispatch)=>{
    const URL=
        search&&search!==""
        ?`${SKILL_ASSESSMENT_RESULTS_VIEW_MARKS_LIST_API}?page=${page}&limit=${limit}&search=${search}`
        :`${SKILL_ASSESSMENT_RESULTS_VIEW_MARKS_LIST_API}/${id}`;
    api()
    .root(API_ROOT)
    .get(URL)
    .success((a)=>{
        if(a?.statusCode===200){
           setLoading && setLoading(false);
           if(id){ 
            dispatch(getResultMarksViewList(a?.details?.nosDetails));
            setTotalPages(a?.details?.totalPages);
            setSortedData(a?.details?.nosDetails);
            }
        }
    })
    .error((e)=>{
        setLoading && setLoading(false);
        devConsoleLog(e);
    })
    .send(()=>{
        setLoading && setLoading(false);
    })
}

export const jobroleListApi=(setLoading , page, search, limit, setTotalPages,setFetchedJobrole)=>(dispatch)=>{
    const URL=
        search&&search!==""
        ?`${SKILL_ASSESSMENT_RESULTS_JOBROLE_LIST_API}?page=${page}&limit=${limit}&search=${search}`
        :`${SKILL_ASSESSMENT_RESULTS_JOBROLE_LIST_API}`;
    api()
    .root(API_ROOT)
    .get(URL)
    .success((a)=>{
        // setLoading && setLoading(false);
        if(a?.statusCode===200){
            dispatch(getJobRoleList(a?.details));
            // setTotalPages(a?.details?.totalPages);
            setFetchedJobrole(a?.details);
        }
    })
    .error((e)=>{
        setLoading && setLoading(false);
        devConsoleLog(e);
    })
    .send(()=>{
        setLoading && setLoading(false);
    })
}