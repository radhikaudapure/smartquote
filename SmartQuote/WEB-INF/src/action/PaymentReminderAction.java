package action;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import pojo.EmptyResponseBean;
import pojo.KeyValuePairBean;
import pojo.PaymentReminderBean;
import responseBeans.KeyValuePairResponseBean;
import test.GlsFileReader;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.opensymphony.xwork2.ActionSupport;

import dao.PaymentReminderDao;

@SuppressWarnings("serial")
public class PaymentReminderAction extends ActionSupport implements ServletRequestAware {
	private EmptyResponseBean objEmptyResponseBean = new EmptyResponseBean();
    ArrayList<KeyValuePairBean> objFileList;
    private KeyValuePairResponseBean objResponseBean;
	private HttpServletRequest request;
	public File reminderFile;
	public String fileName;

	public EmptyResponseBean getObjEmptyResponseBean() {
		return objEmptyResponseBean;
	}

	public void setObjEmptyResponseBean(EmptyResponseBean objEmptyResponseBean) {
		this.objEmptyResponseBean = objEmptyResponseBean;
	}

	public ArrayList<KeyValuePairBean> getObjFileList() {
		return objFileList;
	}

	public void setObjFileList(ArrayList<KeyValuePairBean> objFileList) {
		this.objFileList = objFileList;
	}

	public KeyValuePairResponseBean getObjResponseBean() {
		return objResponseBean;
	}

	public void setObjResponseBean(KeyValuePairResponseBean objResponseBean) {
		this.objResponseBean = objResponseBean;
	}

	public HttpServletRequest getRequest() {
		return request;
	}

	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	public File getReminderFile() {
		return reminderFile;
	}

	public void setReminderFile(File reminderFile) {
		this.reminderFile = reminderFile;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String loadPaymentReminderFile() {
		objEmptyResponseBean.setCode("error");
		objEmptyResponseBean.setMessage(getText("common_error"));
		System.out.println("loadPaymentReminderFile");
		GlsFileReader objFileReader = new test.FileReader();
		System.out.println("Reminder File : " + reminderFile);
		System.out.println("File Name : " + fileName);
		String filename1 = "dataFile.xlsx";
		File fileToCreate = new File(filename1);
		ArrayList<PaymentReminderBean> listReminderBeans = new ArrayList<PaymentReminderBean>();
		try {
			FileUtils.copyFile(reminderFile, fileToCreate);
			JSONArray fileString = objFileReader.readFile(filename1);
			System.out.println("File String :: " + fileString);
			listReminderBeans = new Gson().fromJson(fileString.toString(), new TypeToken<List<PaymentReminderBean>>() {
			}.getType());
			System.out.println(listReminderBeans);
			JSONObject jsonObject = fileString.getJSONObject(0);
			if (jsonObject.has("customerCode") && jsonObject.has("customerName")) {
				System.out.println("1..");
				PaymentReminderDao objDao = new PaymentReminderDao();
				boolean isFileUploaded = objDao.uploadReminderFile(listReminderBeans, fileName);
				objDao.commit();
				objDao.closeAll();
				if (isFileUploaded) {
					objEmptyResponseBean.setCode("success");
					objEmptyResponseBean.setMessage(getText("file_load_success"));
				}
			} else {
				System.out.println("2..");
				objEmptyResponseBean.setCode("error");
				objEmptyResponseBean.setMessage(getText("file_column_invalid"));
			}

		} catch (FileNotFoundException e) {
			objEmptyResponseBean.setCode("error");
			objEmptyResponseBean.setMessage(getText("product_file_not_found"));
			e.printStackTrace();
		} catch (InvalidFormatException e) {
			objEmptyResponseBean.setCode("error");
			objEmptyResponseBean.setMessage(getText("error_file_format"));
			e.printStackTrace();
		} catch (JSONException e) {
			objEmptyResponseBean.setCode("error");
			objEmptyResponseBean.setMessage(getText("error_file_parse"));
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String getLoadedFileList() {
		objResponseBean= new KeyValuePairResponseBean();
		objResponseBean.setCode("error");
		objResponseBean.setMessage(getText("common_error"));
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			objFileList= new ArrayList<KeyValuePairBean>();
			objFileList=objDao.getFileList();
			objDao.closeAll();
			objResponseBean.setCode("success");
			objResponseBean.setMessage("file_list_success");
			objResponseBean.setResult(objFileList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}
	public String unloadPaymentReminderFile() {
		objEmptyResponseBean.setCode("error");
		objEmptyResponseBean.setMessage(getText("common_error"));
		System.out.println("unloadPaymentReminderFile");
		String fileName = request.getParameter("fileName");
		int fileId = Integer.parseInt(request.getParameter("fileId"));
		System.out.println("File Name : " + fileName);
		System.out.println("File Id : " + fileId);
		try {
			PaymentReminderDao objDao = new PaymentReminderDao();
			boolean isUnload=objDao.unloadReminderFile(fileId,fileName);
			objDao.commit();
			objDao.closeAll();
			if (isUnload) {
				objEmptyResponseBean.setCode("success");
				objEmptyResponseBean.setMessage(getText("file_unload_success"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}
	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}



}
