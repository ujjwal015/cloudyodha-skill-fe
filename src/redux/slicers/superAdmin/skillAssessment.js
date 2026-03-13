import { createSlice } from "@reduxjs/toolkit";

const skillAssessmentSlice=createSlice({
    name:"skillAssessment",
    initialState:{
        batchList:[],
        partnerList:[],
        viewCandidateList:[],
        allCandidateList:[],
        accessorList:[],
        accessorDetailsList:[],
        resultList:[],
        resultViewCandidatelist:[],
        resultMarksViewList:[],
        jobroleList:[]
    },
    reducers:{
        getBatchList:(state,{payload})=>{
            state.batchList=payload;
        },
        getPartnerList:(state,{payload})=>{
            state.partnerList=payload;
        },
        getJobRoleList:(state,{payload})=>{
            state.jobroleList=payload;
        },
        getViewCandidateList:(state,{payload})=>{
            state.viewCandidateList=payload;
        },
        getAllCandidateList:(state,{payload})=>{
            state.allCandidateList=payload;
        },
        getAccessorList:(state,{payload})=>{
            state.accessorList=payload;
        },
        getAccessorDetailsList:(state,{payload})=>{
            state.accessorDetailsList=payload;
        },
        getResultList:(state,{payload})=>{
            state.resultList=payload;
        },
        getResultViewCandidateList:(state,{payload})=>{
            state.resultViewCandidatelist=payload;
        },
        getResultMarksViewList:(state,{payload})=>{
            state.resultMarksViewList=payload;
        }
    }
})


export const {getJobRoleList,getAccessorDetailsList,getPartnerList,getResultMarksViewList,getResultViewCandidateList,getResultList,getViewCandidateList,getBatchList,getAllCandidateList,getAccessorList}=skillAssessmentSlice.actions;
export const skilAssessmentSelector = (state) => state.superAdmin.skillAssessment;
const skillAssementSliceReducer=skillAssessmentSlice.reducer;
export default skillAssementSliceReducer;


