package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.util.ArrayList;

import org.apache.commons.lang3.text.WordUtils;

import pojo.PDFMasterReportBean;
import pojo.PDFSubReportBean;
import connection.ConnectionFactory;

public class CustComparisonDao {
	Connection conn = null;
	ResultSet rs = null;
	PreparedStatement pstmt = null;

	public CustComparisonDao() {
		conn = new ConnectionFactory().getConnection();
		try {
			conn.setAutoCommit(false);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void commit() {
		try {
			conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void closeAll() {
		try {
			if (conn != null)
				conn.close();
			if (rs != null)
				rs.close();
			if (pstmt != null)
				pstmt.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public ArrayList<PDFSubReportBean> getProductDetails(String quoteId) {
		ArrayList<PDFSubReportBean> productList = new ArrayList<PDFSubReportBean>();
		
		PDFSubReportBean objPdfSubReportBean = null;
		
		String getData = "select quote_detail_id,quote_id,product_id,item_description,"
				+ "ifnull(description2, '')description2,"
				+ "ifnull(description3, '')description3,product_qty,avg_cost,quote_price,total, "
				+ " gp_required,current_supplier_price,current_supplier_gp,current_supplier_total,savings,"
				+ " ifnull(gst_flag, 'no') gst_flag,"
				+ " ifnull(is_alternate, 'no') is_alternate, ifnull(alternate_for, 0) alternate_for,"
				+ " unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, price3exGST, "
				+ " qty_break4, price4exGST, tax_code,comment "
				+ " from create_quote_details qd join product_master pm on qd.product_id = pm.item_code "
				+ " where quote_id='" + quoteId+"'"
				+ " order by quote_detail_id;";
		try {
			pstmt = conn.prepareStatement(getData);
			rs = pstmt.executeQuery();
			// System.out.println("Quote Details : " + pstmt);
			while (rs.next()) {
				objPdfSubReportBean = new PDFSubReportBean();
				objPdfSubReportBean.setProductCode(rs.getString("product_id"));
				String desc=rs.getString("item_description");
				if (!rs.getString("description2").equals("-")&& !rs.getString("description2").equals("")) {
					desc=desc+" "+rs.getString("description2"); 
				}
				if (!rs.getString("description3").equals("-")&&!rs.getString("description3").equals("")) {
					desc=desc+" "+rs.getString("description3"); 
				}
			
				objPdfSubReportBean.setProductDescription(desc);
				objPdfSubReportBean.setProductUOM(rs.getString("unit"));
				objPdfSubReportBean.setProductQty(rs.getInt("product_qty"));
				objPdfSubReportBean.setProductCurrentPriceExGST(getTwoDecimal(rs.getDouble("current_supplier_price")));
//				System.out.println("CurrentSupplier"+(rs.getDouble("current_supplier_price")));
				objPdfSubReportBean.setProductCurrentPriceTotalExGST(getTwoDecimal(rs.getDouble("current_supplier_total")));
				objPdfSubReportBean.setProductJaybelPriceExGST(getTwoDecimal(rs.getDouble("quote_price")));
//				System.out.println("JaybelQuotePrice"+(rs.getDouble("quote_price")));
				objPdfSubReportBean.setProductJaybelPriceTotalExGST(getTwoDecimal(rs.getDouble("total")));
//				System.out.println("SAVINGS :: "+rs.getDouble("savings"));
				objPdfSubReportBean.setProductSavings(getTwoDecimal(rs.getDouble("savings")));
				objPdfSubReportBean.setQuoteDetailId(rs.getInt("quote_detail_id"));
				objPdfSubReportBean.setAltForQuoteDetailId(rs.getInt("alternate_for"));
				objPdfSubReportBean.setIsAlternative(rs.getString("is_alternate"));
				objPdfSubReportBean.setGstExempt(rs.getString("gst_flag"));
				objPdfSubReportBean.setLineComment(rs.getString("comment"));
				productList.add(objPdfSubReportBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return productList;
	}

	public PDFMasterReportBean getQuoteInfo(String quoteId) {
		ArrayList<PDFSubReportBean> productList = new ArrayList<PDFSubReportBean>();
		PDFMasterReportBean objPdfMasterReportBean=null;
		DateFormat sdf =  new java.text.SimpleDateFormat("dd/MM/YYYY");

		String getQuoteDetail="SELECT "
				+ "cq.quote_id,cq.custcode,cm.customer_name 'proposalFor',cm.add1,cm.phone,cm.email,cm.fax_no,"
				+ "cq.quote_attn 'quoteAttn',cq.prices_gst_include,cq.notes,cq.user_id,"
//				+ "DATE_FORMAT(ifnull(modified_date,created_date), '%d-%m-%Y') as quoteDate,"
				+ "DATE(ifnull(modified_date,created_date)) quoteDate,"
				+ "cq.current_supplier_id,cs.current_supplier_name,"
				+ "usr.user_id 'sales_person_id',usr.user_name 'sales_person_name' ,"
				+ "usr.email 'sales_person_email', usr.contact 'sales_person_contact', "
				+ "compete_quote,status, cm.cust_id 'customerId' "
				+ "FROM create_quote cq "
				+ "left outer join customer_master cm on cq.custcode=cm.customer_code "
				+ "left outer join current_supplier cs on cq.current_supplier_id=cs.current_supplier_id "
				+ "left outer join user_master usr on usr.user_id=cq.sales_person_id "
				+ "WHERE quote_id = '"+quoteId+"'"
				+ "order by created_date desc;";
		try {
			pstmt = conn.prepareStatement(getQuoteDetail);
//			pstmt.setString(1, quoteId);
			System.out.println(pstmt);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objPdfMasterReportBean = new PDFMasterReportBean();
				objPdfMasterReportBean.setDedicatedAccountManagerId(rs.getInt("sales_person_id"));
				objPdfMasterReportBean.setDedicatedAccountManager(rs.getString("sales_person_name"));
				objPdfMasterReportBean.setDedicatedAccountManagerEmail(rs.getString("sales_person_email"));
				objPdfMasterReportBean.setDedicatedAccountManagerContact(rs.getString("sales_person_contact"));
				
				
				objPdfMasterReportBean.setEmail(rs.getString("email"));
				objPdfMasterReportBean.setQuoteId(rs.getString("quote_id"));
				objPdfMasterReportBean.setGstInclusive(rs.getBoolean("prices_gst_include"));
				objPdfMasterReportBean.setQuoteDate(sdf.format(rs.getDate("quoteDate")));
				objPdfMasterReportBean.setProposalFor(WordUtils.capitalizeFully(rs.getString("proposalFor")));
				objPdfMasterReportBean.setSubmittedBy(rs.getString("sales_person_name"));
				objPdfMasterReportBean.setQuoteAttn(WordUtils.capitalizeFully(rs.getString("quoteAttn")));
				objPdfMasterReportBean.setCustId(rs.getInt("customerId"));
				
				//====
				productList = getProductDetails(rs.getString("quote_id"));
     			objPdfMasterReportBean.setArrayPdfSubReportBean(productList);

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return objPdfMasterReportBean;
	}


	public double getTwoDecimal(double total){
		double roundTotal=0;	
		roundTotal=Double.parseDouble(String.format( "%.2f", total));
		return roundTotal;
	}
	

}
