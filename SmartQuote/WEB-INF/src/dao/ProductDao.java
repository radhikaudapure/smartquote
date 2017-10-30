package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import pojo.KeyValuePairBean;
import pojo.ProductBean;
import pojo.ProductCodeUpdateBean;
import pojo.ProductGroupBean;
import connection.ConnectionFactory;

public class ProductDao {
	Connection conn = null;
	ResultSet rs = null;
	PreparedStatement pstmt = null;
	
	public ProductDao() {
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

	public ArrayList<KeyValuePairBean> getProductList(String productLike) {
//		System.out.println("getProductList init :::"+df.format(dateobj));
		ArrayList<KeyValuePairBean> pairBeans = new ArrayList<KeyValuePairBean>();
		KeyValuePairBean objKeyValuePairBean = null;
		System.out.println("T1: "+ System.currentTimeMillis());
		String getProdustList = "SELECT item_code, "
				+ "ifnull(item_description, 'No Description') item_description,"
				+ "ifnull(description2, 'No Description') description2, "
				+ "ifnull(description3, 'No Description') description3 "
				+ "FROM product_master";
		System.out.println("Query>>");
		System.out.println(getProdustList);
		try {
			pstmt = conn.prepareStatement(getProdustList);
			rs = pstmt.executeQuery();
			int rsCount = 0;
			while (rs.next()) {
				objKeyValuePairBean = new KeyValuePairBean();
				objKeyValuePairBean.setCode(rs.getString("item_code"));
				objKeyValuePairBean.setValue(
						rs.getString("item_code") 
						+ " ( " + rs.getString("item_description") 
					    +" " + rs.getString("description2") 
						+" " + rs.getString("description3") + " )");
				pairBeans.add(objKeyValuePairBean);
				rsCount = rsCount + 1;
			}
			System.out.println("T2: "+ System.currentTimeMillis());
			System.out.println("RowCount>>"+rsCount);
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
//		System.out.println("getProductList deinit :::"+df.format(dateobj));
		return pairBeans;
	}

	public boolean isProductExist(String productCode) {
		boolean isProductExist = false;
		String getUserGroups = "SELECT item_code FROM product_master WHERE item_code = ?";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, productCode);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				isProductExist = true;
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isProductExist;
	}

	public boolean saveProduct(ProductBean objBean) {
		boolean isProductCreated = false;
		try {
			String createUserQuery = "INSERT IGNORE INTO product_master (item_code, item_description, description2, "
					+ " description3, unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, "
					+ " price3exGST, qty_break4, price4exGST, avg_cost, tax_code, created_by,product_group_code,"
					+ " qty_break0,gst_flag, promo_price) "
					+ " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?,?,?, ?)";
			pstmt = conn.prepareStatement(createUserQuery);
			pstmt.setString(1, objBean.getItemCode());
			pstmt.setString(2, objBean.getItemDescription());
			pstmt.setString(3, objBean.getDescription2());
			pstmt.setString(4, objBean.getDescription3());
			pstmt.setString(5, objBean.getUnit());
			pstmt.setDouble(6, objBean.getPrice0exGST());
			pstmt.setDouble(7, objBean.getQtyBreak1());
			pstmt.setDouble(8, objBean.getPrice1exGST());
			pstmt.setDouble(9, objBean.getQtyBreak2());
			pstmt.setDouble(10, objBean.getPrice2exGST());
			pstmt.setDouble(11, objBean.getQtyBreak3());
			pstmt.setDouble(12, objBean.getPrice3exGST());
			pstmt.setDouble(13, objBean.getQtyBreak4());
			pstmt.setDouble(14, objBean.getPrice4exGST());
			pstmt.setDouble(15, objBean.getAvgcost());
			pstmt.setString(16, objBean.getTaxCode());
			pstmt.setString(17, objBean.getProductGroupCode());
			pstmt.setDouble(18, objBean.getQtyBreak0());
			pstmt.setString(19, objBean.getGstFlag());
			pstmt.setDouble(20, objBean.getPromoPrice());
//			System.out.println("GST FLAG"+objBean.getGstFlag());
			pstmt.executeUpdate();
			isProductCreated = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isProductCreated;
	}

	public ProductBean getProductDetails(String productCode) {
		ProductBean objBean = null;
		String getUserGroups = "SELECT item_code, item_description, description2, "
				+ " description3, unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, "
				+ " price3exGST, qty_break4, price4exGST, avg_cost, tax_code, created_by,"
				+ " ifnull(gst_flag, 'NO') gst_flag, promo_price as promoPrice "
				+ " FROM product_master WHERE item_code = ?";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, productCode);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objBean = new ProductBean();
				objBean.setItemCode(rs.getString("item_code"));
				objBean.setItemDescription(rs.getString("item_description"));
				objBean.setDescription2(rs.getString("description2"));
				objBean.setDescription3(rs.getString("description3"));
				objBean.setUnit(rs.getString("unit"));
				objBean.setPrice0exGST(rs.getDouble("price0exGST"));
				objBean.setQtyBreak1(rs.getDouble("qty_break1"));
				objBean.setPrice1exGST(rs.getDouble("price1exGST"));
				objBean.setQtyBreak2(rs.getDouble("qty_break2"));
				objBean.setPrice2exGST(rs.getDouble("price2exGST"));
				objBean.setQtyBreak3(rs.getDouble("qty_break3"));
				objBean.setPrice3exGST(rs.getDouble("price3exGST"));
				objBean.setQtyBreak4(rs.getDouble("qty_break4"));
				objBean.setPrice4exGST(rs.getDouble("price4exGST"));
				objBean.setAvgcost(rs.getDouble("avg_cost"));
				objBean.setTaxCode(rs.getString("tax_code"));
				objBean.setCreated_by(rs.getString("created_by"));
				objBean.setGstFlag(rs.getString("gst_flag"));
				objBean.setPromoPrice(rs.getDouble("promoPrice"));
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return objBean;
	}
	public ProductBean getProductDetailsWithAlternatives(String productCode) {
		ProductBean objBean=new ProductBean();
		String getProductDetails="SELECT item_code, item_description, description2, "
				+ " description3, unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, "
				+ " price3exGST, qty_break4, price4exGST, avg_cost, tax_code, created_by,"
				+ " ifnull(gst_flag, 'NO') gst_flag, promo_price as promoPrice "
				+ " FROM product_master WHERE item_code = ?";
		
		try {
			pstmt = conn.prepareStatement(getProductDetails);
			pstmt.setString(1, productCode);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objBean = new ProductBean();
				objBean.setItemCode(rs.getString("item_code"));
				objBean.setItemDescription(rs.getString("item_description"));
				objBean.setDescription2(rs.getString("description2"));
				objBean.setDescription3(rs.getString("description3"));
				objBean.setUnit(rs.getString("unit"));
				objBean.setPrice0exGST(rs.getDouble("price0exGST"));
				objBean.setQtyBreak1(rs.getDouble("qty_break1"));
				objBean.setPrice1exGST(rs.getDouble("price1exGST"));
				objBean.setQtyBreak2(rs.getDouble("qty_break2"));
				objBean.setPrice2exGST(rs.getDouble("price2exGST"));
				objBean.setQtyBreak3(rs.getDouble("qty_break3"));
				objBean.setPrice3exGST(rs.getDouble("price3exGST"));
				objBean.setQtyBreak4(rs.getDouble("qty_break4"));
				objBean.setPrice4exGST(rs.getDouble("price4exGST"));
				objBean.setAvgcost(rs.getDouble("avg_cost"));
				objBean.setTaxCode(rs.getString("tax_code"));
				objBean.setCreated_by(rs.getString("created_by"));
				objBean.setGstFlag(rs.getString("gst_flag"));
				objBean.setPromoPrice(rs.getDouble("promoPrice"));
			}
			ArrayList<ProductBean> arrayProductBeans=new ArrayList<ProductBean>();
			boolean isAltAdded=false;
			arrayProductBeans=getAlternatives(productCode);
			if(arrayProductBeans.size()>0){
				isAltAdded=true;
			}
			if (isAltAdded) {
//				System.out.println("If rs.next");
//				objBean.setAlternativeProductAdded(true);	
				objBean.setAlternativeProductList(arrayProductBeans);
			}
			
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return objBean;
	}
	public ArrayList<ProductBean> getAlternatives(String productCode) {
//		System.out.println("GET Alternatives...");
//		System.out.println("Product Code"+productCode);
//		ArrayList<AlternateProductBean> arrayAlternateProductBeans=new ArrayList<AlternateProductBean>();
		ArrayList<ProductBean> arrayProductBeans=new ArrayList<ProductBean>();
		String getAlternatives="SELECT a.alternative_product_id 'alt_product_id', "
//				+ "a.alternative_default_price 'alt_default_price', "
				+ "p.item_description 'alt_item_desc',p.description2 'alt_item_desc2',p.description3 'alt_item_desc3',"
				+ "p.avg_cost 'alt_avg_cost',p.unit 'alt_unit',p.price0exGST 'alt_price0exGST',"
				+ "p.price1exGST 'alt_price1exGST',p.price2exGST 'alt_price2exGST',p.price3exGST 'alt_price3exGST',"
				+ "p.price4exGST 'alt_price4exGST',"
				+ "ifnull(p.gst_flag, 'NO') 'alt_gst_flag', p.promo_price as promoPrice "
				+ "FROM alternative_product_master a, product_master p "
				+ "WHERE a.main_product_id = ? AND p.item_code=a.alternative_product_id;";
		
		try {
			pstmt = conn.prepareStatement(getAlternatives);
			pstmt.setString(1, productCode);
			rs = pstmt.executeQuery();
			ProductBean objProductBean=null;
			while (rs.next()) {
				objProductBean=new ProductBean();
				objProductBean.setItemCode(rs.getString("alt_product_id"));
//				objProductBean.setAltDefaultPrice(rs.getDouble("alt_default_price"));
//				System.out.println("alt_product_id >>"+rs.getString("alt_product_id"));
				objProductBean.setItemDescription(rs.getString("alt_item_desc"));
				objProductBean.setDescription2(rs.getString("alt_item_desc2"));
				objProductBean.setDescription3(rs.getString("alt_item_desc3"));
				objProductBean.setAvgcost(rs.getDouble("alt_avg_cost"));
				objProductBean.setUnit(rs.getString("alt_unit"));
				objProductBean.setPrice0exGST(rs.getDouble("alt_price0exGST"));
				objProductBean.setPrice1exGST(rs.getDouble("alt_price1exGST"));
				objProductBean.setPrice2exGST(rs.getDouble("alt_price2exGST"));
				objProductBean.setPrice3exGST(rs.getDouble("alt_price3exGST"));
				objProductBean.setPrice4exGST(rs.getDouble("alt_price4exGST"));
				objProductBean.setGstFlag(rs.getString("alt_gst_flag"));
				objProductBean.setPromoPrice(rs.getDouble("promoPrice"));
				
				arrayProductBeans.add(objProductBean);
			}
//			System.out.println("GET Alternatives List Size ..."+arrayProductBeans.size());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return arrayProductBeans;
	}
	public boolean updateProduct(ProductBean objBean) {
		boolean isCustomerUpdated = false;
		try {
			String updateCustQuery = "UPDATE product_master SET item_code = ?, item_description = ?, description2 = ?, "
					+ " description3 = ?, unit = ?, price0exGST = ?, qty_break1 = ?, price1exGST = ?, qty_break2 = ?, "
					+ " price2exGST = ?, qty_break3 = ?, price3exGST = ?, qty_break4 = ?, price4exGST = ?, avg_cost = ?, "
					+ " tax_code = ?, created_by = 0, product_group_code = ?, qty_break0 = ?, gst_flag = ?, promo_price= ? " + " WHERE item_code = ? ";
			PreparedStatement pstmt = conn.prepareStatement(updateCustQuery);
			pstmt.setString(1, objBean.getItemCode());
			pstmt.setString(2, objBean.getItemDescription());
			pstmt.setString(3, objBean.getDescription2());
			pstmt.setString(4, objBean.getDescription3());
			pstmt.setString(5, objBean.getUnit());
			pstmt.setDouble(6, objBean.getPrice0exGST());
			pstmt.setDouble(7, objBean.getQtyBreak1());
			pstmt.setDouble(8, objBean.getPrice1exGST());
			pstmt.setDouble(9, objBean.getQtyBreak2());
			pstmt.setDouble(10, objBean.getPrice2exGST());
			pstmt.setDouble(11, objBean.getQtyBreak3());
			pstmt.setDouble(12, objBean.getPrice3exGST());
			pstmt.setDouble(13, objBean.getQtyBreak4());
			pstmt.setDouble(14, objBean.getPrice4exGST());
			pstmt.setDouble(15, objBean.getAvgcost());
			pstmt.setString(16, objBean.getTaxCode());
			pstmt.setString(17, objBean.getProductGroupCode());
			pstmt.setDouble(18, objBean.getQtyBreak0());
			pstmt.setString(19, objBean.getGstFlag());
			pstmt.setDouble(20, objBean.getPromoPrice());
			pstmt.setString(21, objBean.getItemCode());

			pstmt.executeUpdate();
			isCustomerUpdated = true;
		} catch (SQLException e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isCustomerUpdated;
	}

	public boolean deleteProduct(String productCode) {
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM product_master WHERE item_code = ?";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setString(1, productCode);
			pstmt.executeUpdate();
			isDeleted = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isDeleted;
	}

	public boolean uploadProductFile(ArrayList<ProductBean> productList) {
		boolean isFileUploaded = false;
		try {
			String productQuery = "REPLACE INTO product_master (item_code, item_description, description2, "
					+ " description3, unit, price0exGST, qty_break1, price1exGST, qty_break2, price2exGST, qty_break3, "
					+ " price3exGST, qty_break4, price4exGST, avg_cost, tax_code, created_by, qty_break0, product_group_code,gst_flag) "
					+ " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?,?)";
			pstmt = conn.prepareStatement(productQuery);
			final int batchSize = 5000;
			int count = 0;

			for (int i = 0; i < productList.size(); i++) {
				pstmt.setString(1, productList.get(i).getItemCode());
				pstmt.setString(2, productList.get(i).getItemDescription());
				pstmt.setString(3, productList.get(i).getDescription2());
				pstmt.setString(4, productList.get(i).getDescription3());
				pstmt.setString(5, productList.get(i).getUnit());
				pstmt.setDouble(6, productList.get(i).getPrice0exGST());
				pstmt.setDouble(7, productList.get(i).getQtyBreak1());
				pstmt.setDouble(8, productList.get(i).getPrice1exGST());
				pstmt.setDouble(9, productList.get(i).getQtyBreak2());
				pstmt.setDouble(10, productList.get(i).getPrice2exGST());
				pstmt.setDouble(11, productList.get(i).getQtyBreak3());
				pstmt.setDouble(12, productList.get(i).getPrice3exGST());
				pstmt.setDouble(13, productList.get(i).getQtyBreak4());
				pstmt.setDouble(14, productList.get(i).getPrice4exGST());
//				pstmt.setDouble(15, productList.get(i).getAvgcost());
				pstmt.setDouble(15, productList.get(i).getLastBuyPrice());
				pstmt.setString(16, productList.get(i).getTaxCode());
//				pstmt.setDouble(17, productList.get(i).getQtyBreak0());
				pstmt.setString(17, productList.get(i).getGroup());
				String gstExempt=productList.get(i).getTaxCode();
				if (gstExempt.equalsIgnoreCase("E")) {
					pstmt.setString(18,"YES");
				} else {
					pstmt.setString(18,"NO");
				}
//				System.out.println("Promo Price :: "+productList.get(i).getPromoPrice());
//				pstmt.setDouble(20, productList.get(i).getPromoPrice());
				pstmt.addBatch();
				if (++count % batchSize == 0) {
					System.out.println("Batch Executed...!");
					pstmt.executeBatch();
				}
			}
			pstmt.executeBatch(); // Insert remaining records
			System.out.println("Remaining Executed...!");
			isFileUploaded = true;
		} catch (Exception e) {
			System.out.println("SQLException 1 :" + e);
			try {
				conn.rollback();
			} catch (SQLException e1) {
				System.out.println("SQLException 2 :" + e1);
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isFileUploaded;
	}
	public boolean uploadProductPromoPrice(ArrayList<ProductBean> productList) {
		boolean isFileUploaded = false;
		
		try {
			String productQuery = "UPDATE product_master set promo_price = ? where item_code = ? ;";
			pstmt = conn.prepareStatement(productQuery);
			final int batchSize = 5000;
			int count = 0;
			for (int i = 0; i < productList.size(); i++) {
				pstmt.setDouble(1, productList.get(i).getPromoPrice());
				pstmt.setString(2, productList.get(i).getItemCode());
				pstmt.addBatch();
				if (++count % batchSize == 0) {
					System.out.println("Batch Executed...!");
					pstmt.executeBatch();
				}
			}
			pstmt.executeBatch();
//			System.out.println("Remaining Executed...!");
//			System.out.println("Promo Price updated...!");
			isFileUploaded = true;
		} catch (Exception e) {
			System.out.println("SQLException 1 :" + e);
			try {
				conn.rollback();
			} catch (SQLException e1) {
				System.out.println("SQLException 2 :" + e1);
				e1.printStackTrace();
			}
			e.printStackTrace();
		}finally{
			try {
				conn.commit();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return isFileUploaded;
	};
	
	public boolean addCodeInProductCodeVersion(ArrayList<ProductCodeUpdateBean> productCodeList) throws Exception{
		boolean isInserted = false;
		String insertQryOnProductCodeVersion="INSERT IGNORE INTO product_code_version (old_item_code,new_item_code)"
				+ " VALUES(?,?);";
		pstmt = conn.prepareStatement(insertQryOnProductCodeVersion);
		final int batchSize = 5000;
		int count = 0;
		for (int i = 0; i < productCodeList.size(); i++) {
			pstmt.setString(1, productCodeList.get(i).getOldItemCode());
			pstmt.setString(2, productCodeList.get(i).getNewItemCode());
			pstmt.addBatch();
			if (++count % batchSize == 0) {
				System.out.println("Batch Executed...!");
				pstmt.executeBatch();
			}
		}
		pstmt.executeBatch();
		isInserted=true;
		return isInserted;
	}
	
	public boolean updateCodeInProductMaster() throws Exception{
		boolean isUpdated = false;
		int result=0;
		String updateProductCode="update product_master a, product_code_version b "
				+ "set a.item_code = b.new_item_code where a.item_code = b.old_item_code";
		pstmt = conn.prepareStatement(updateProductCode);
		pstmt.executeUpdate();
		if (result>0) {
			isUpdated=true;
		}
		return isUpdated;
	}
	public boolean updateCodeInCreateQuoteDetails() throws Exception{
		boolean isUpdated = false;
		int result=0;
		String updateProductCode="update create_quote_details a, product_code_version b "
				+ "set a.product_id = b.new_item_code where a.product_id = b.old_item_code";
		pstmt = conn.prepareStatement(updateProductCode);
		pstmt.executeUpdate();
		if (result>0) {
			isUpdated=true;
		}
		return isUpdated;
	}
	public boolean updateMainIdInAlternativeMaster() throws Exception{
		boolean isUpdated = false;
		int result=0;
		String updateProductCode="update alternative_product_master a, product_code_version b "
				+ "set a.main_product_id = b.new_item_code where a.main_product_id = b.old_item_code";
		pstmt = conn.prepareStatement(updateProductCode);
		pstmt.executeUpdate();
		if (result>0) {
			isUpdated=true;
		}
		return isUpdated;
	}
	public boolean updateAltIdAlternativeMaster() throws Exception{
		boolean isUpdated = false;
		int result=0;
		String updateProductCode="update alternative_product_master a, product_code_version b "
				+ "set a.main_product_id = b.new_item_code where a.main_product_id = b.old_item_code";
		pstmt = conn.prepareStatement(updateProductCode);
		pstmt.executeUpdate();
		if (result>0) {
			isUpdated=true;
		}
		return isUpdated;
	}
	public boolean updateProductCode(ArrayList<ProductCodeUpdateBean> productCodeList) {
		System.out.println("updateProductCode");
		boolean isFileUploaded=false,isInserted= false;
		try {
			System.out.println("Product Code List "+productCodeList);
			isInserted=addCodeInProductCodeVersion(productCodeList);
			if (isInserted) {
				updateCodeInProductMaster();
				updateCodeInCreateQuoteDetails();
				updateMainIdInAlternativeMaster();
				updateAltIdAlternativeMaster();
				isFileUploaded=true;
			}
			
		} catch (Exception e) {
		e.printStackTrace();
		}finally{
			try {
				conn.commit();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return isFileUploaded;
	}
	public boolean deletedPreviousProduct(String productCodeString) {
		System.out.println("deletedPreviousProduct :: "+productCodeString);
		boolean isDeleted = false;
		try {
			String deleteGroupQuery = "DELETE FROM product_master WHERE item_code in(?)";
			PreparedStatement pstmt = conn.prepareStatement(deleteGroupQuery);
			pstmt.setString(1, productCodeString);
			pstmt.executeUpdate();
			isDeleted = true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return isDeleted;
	}

	public ArrayList<ProductBean> getAllProductDetailsList(int fromLimit, int toLimit) {
		ArrayList<ProductBean> objProductBeans = new ArrayList<ProductBean>();
		ProductBean objBean = null;
		String getUserGroups = "SELECT item_code, pm.product_group_code, "
				+ " ifnull(item_description, '') item_description, "
				+ " ifnull(description2, '') description2, description3, unit,"
				+ " ifnull(qty_break0, '0.0') qty_break0, ifnull(price0exGST, '') price0exGST, "
				+ " ifnull(qty_break1, '0.0') qty_break1, ifnull(price1exGST, '0.0') price1exGST, "
				+ " ifnull(qty_break2, '0.0') qty_break2, ifnull(price2exGST, '0.0') price2exGST, "
				+ " ifnull(qty_break3, '0.0') qty_break3, ifnull(price3exGST, '0.0') price3exGST, "
				+ " ifnull(qty_break4, '0.0') qty_break4, ifnull(price4exGST, '0.0') price4exGST, "
				+ " ifnull(avg_cost, '0.0') avg_cost, ifnull(tax_code, '') tax_code, "
				+ " created_by , product_group_name, pm.product_group_code,ifnull(gst_flag, 'NO') gst_flag, "
				+ " promo_price as promoPrice "
				+ " FROM product_master pm left join product_group pg on pm.product_group_code = pg.product_group_code "
				+ " order by 1, 2 limit " + fromLimit + "," + toLimit + "";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objBean = new ProductBean();
				objBean.setItemCode(rs.getString("item_code"));
				objBean.setItemDescription(rs.getString("item_description"));
				objBean.setDescription2(rs.getString("description2"));
				objBean.setDescription3(rs.getString("description3"));
				objBean.setUnit(rs.getString("unit"));
				objBean.setQtyBreak0(rs.getDouble("qty_break0"));
				objBean.setPrice0exGST(rs.getDouble("price0exGST"));
				objBean.setQtyBreak1(rs.getDouble("qty_break1"));
				objBean.setPrice1exGST(rs.getDouble("price1exGST"));
				objBean.setQtyBreak2(rs.getDouble("qty_break2"));
				objBean.setPrice2exGST(rs.getDouble("price2exGST"));
				objBean.setQtyBreak3(rs.getDouble("qty_break3"));
				objBean.setPrice3exGST(rs.getDouble("price3exGST"));
				objBean.setQtyBreak4(rs.getDouble("qty_break4"));
				objBean.setPrice4exGST(rs.getDouble("price4exGST"));
				objBean.setAvgcost(rs.getDouble("avg_cost"));
				objBean.setTaxCode(rs.getString("tax_code"));
				objBean.setCreated_by(rs.getString("created_by"));
				objBean.setProductGroupCode(rs.getString("product_group_code"));
				objBean.setProductGroupName(rs.getString("product_group_name"));
				objBean.setGstFlag(rs.getString("gst_flag"));
				objBean.setPromoPrice(rs.getDouble("promoPrice"));
				objProductBeans.add(objBean);
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return objProductBeans;
	}

	public ArrayList<ProductBean> getSearchedProductDetailsList(String productLike) {
		ArrayList<ProductBean> objProductBeans = new ArrayList<ProductBean>();
		ProductBean objBean = null;
		String getUserGroups = "SELECT item_code, pm.product_group_code, "
				+ " ifnull(item_description, '') item_description, "
				+ " ifnull(description2, '') description2, description3, unit,"
				+ " ifnull(qty_break0, '0.0') qty_break0, ifnull(price0exGST, '') price0exGST, "
				+ " ifnull(qty_break1, '0.0') qty_break1, ifnull(price1exGST, '0.0') price1exGST, "
				+ " ifnull(qty_break2, '0.0') qty_break2, ifnull(price2exGST, '0.0') price2exGST, "
				+ " ifnull(qty_break3, '0.0') qty_break3, ifnull(price3exGST, '0.0') price3exGST, "
				+ " ifnull(qty_break4, '0.0') qty_break4, ifnull(price4exGST, '0.0') price4exGST, "
				+ " ifnull(avg_cost, '0.0') avg_cost, ifnull(tax_code, '') tax_code, created_by , product_group_name, pm.product_group_code,ifnull(gst_flag, 'NO') gst_flag, "
				+ " ifnull(promo_price, '0.0') promo_price"
				+ " FROM product_master pm left join product_group pg on pm.product_group_code = pg.product_group_code "
				+ " WHERE item_code like ? OR item_description like ?" + " order by 1, 2 ";
		try {
			pstmt = conn.prepareStatement(getUserGroups);
			pstmt.setString(1, productLike);
			pstmt.setString(2, productLike);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objBean = new ProductBean();
				objBean.setItemCode(rs.getString("item_code"));
				objBean.setItemDescription(rs.getString("item_description"));
				objBean.setDescription2(rs.getString("description2"));
				objBean.setDescription3(rs.getString("description3"));
				objBean.setUnit(rs.getString("unit"));
				objBean.setQtyBreak0(rs.getDouble("qty_break0"));
				objBean.setPrice0exGST(rs.getDouble("price0exGST"));
				objBean.setQtyBreak1(rs.getDouble("qty_break1"));
				objBean.setPrice1exGST(rs.getDouble("price1exGST"));
				objBean.setQtyBreak2(rs.getDouble("qty_break2"));
				objBean.setPrice2exGST(rs.getDouble("price2exGST"));
				objBean.setQtyBreak3(rs.getDouble("qty_break3"));
				objBean.setPrice3exGST(rs.getDouble("price3exGST"));
				objBean.setQtyBreak4(rs.getDouble("qty_break4"));
				objBean.setPrice4exGST(rs.getDouble("price4exGST"));
				objBean.setAvgcost(rs.getDouble("avg_cost"));
				objBean.setTaxCode(rs.getString("tax_code"));
				objBean.setCreated_by(rs.getString("created_by"));
				objBean.setProductGroupCode(rs.getString("product_group_code"));
				objBean.setProductGroupName(rs.getString("product_group_name"));
				objBean.setGstFlag(rs.getString("gst_flag"));
				objBean.setPromoPrice(rs.getDouble("promo_price"));
				objProductBeans.add(objBean);
			}
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return objProductBeans;
	}

	public ArrayList<ProductGroupBean> getDistinctProductGroupList() {
		ArrayList<ProductGroupBean> objProductGroupBeans = new ArrayList<ProductGroupBean>();
		ProductGroupBean objBean = null;
		String sqlGetDistinctProductGroup = "select distinct(product_group_code) from product_master";
		try {
			pstmt = conn.prepareStatement(sqlGetDistinctProductGroup);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				objBean = new ProductGroupBean();
				objBean.setProductCode(rs.getString("product_group_code"));
				objBean.setProductName("No Description");
				objBean.setCatalogueNo("No Description");
				objProductGroupBeans.add(objBean);
			}
		} catch (Exception e) {
			e.printStackTrace();
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}

		return objProductGroupBeans;
	}
}