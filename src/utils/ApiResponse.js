class ApiResponse{
    constructor(satusCOde,data, message = "success"){
        this.statusCode = satusCOde
        this.data = data
        this.success = this.statusCode < 400
        this.message = message
    }
}
export {ApiResponse}    