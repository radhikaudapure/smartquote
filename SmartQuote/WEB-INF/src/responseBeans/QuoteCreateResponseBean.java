package responseBeans;

import responseStructure.Response;

public class QuoteCreateResponseBean extends Response{
private	boolean isNewProductCreated=false;
private	boolean isNewCustomerCreated=false;
private	int genratedCustomerId=0;
private	boolean isNewSupplierCreated=false;
private	int genratedSupplierId=0;
public boolean isNewCustomerCreated() {
	return isNewCustomerCreated;
}
public void setNewCustomerCreated(boolean isNewCustomerCreated) {
	this.isNewCustomerCreated = isNewCustomerCreated;
}
public int getGenratedCustomerId() {
	return genratedCustomerId;
}
public void setGenratedCustomerId(int genratedCustomerId) {
	this.genratedCustomerId = genratedCustomerId;
}
public boolean isNewSupplierCreated() {
	return isNewSupplierCreated;
}
public void setNewSupplierCreated(boolean isNewSupplierCreated) {
	this.isNewSupplierCreated = isNewSupplierCreated;
}
public int getGenratedSupplierId() {
	return genratedSupplierId;
}
public void setGenratedSupplierId(int genratedSupplierId) {
	this.genratedSupplierId = genratedSupplierId;
}
public boolean isNewProductCreated() {
	return isNewProductCreated;
}
public void setNewProductCreated(boolean isNewProductCreated) {
	this.isNewProductCreated = isNewProductCreated;
}

	

}
