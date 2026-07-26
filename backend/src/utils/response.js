/*Standardizes all API responses
Every API response looks the same
Clean and consistent*/

const successresponse = (res,statusCode,message,data=null)=>{
  const response ={success:true,message};
  if(data) response.data=data;
  return res.status(statusCode).json(response);
}

const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { successResponse, errorResponse };