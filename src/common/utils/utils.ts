import kosamaConfig from "../../../config/kosamaConfig";

export const getImageUrl = (path: string | undefined) => {
    if (path == undefined) {
        return null;
    }
    if (path.includes("http")) {
        return path;
    }
    return kosamaConfig.baseHost + path
};


export const formatTableParams = (params: { [key: string]: any }) => {
    var newParams : { [key: string]: any } = {
        page: params.current
    };

    var search : { [key: string] : string } = (({ current, pageSize, ...o }) => o)(params);
    Object.entries(search).forEach(([key, value]) => {
        newParams[`search[${key}]`] = value;
    });

    return newParams;
}