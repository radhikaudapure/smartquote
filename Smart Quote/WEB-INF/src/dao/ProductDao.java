package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import pojo.AlternateProductBean;
import pojo.KeyValuePairBean;
import pojo.ProductBean;
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
//			pstmt.setString(1, productLike);
//			pstmt.setString(2, productLike);
//			pstmt.setString(3, productLike);
//			pstmt.setString(4, productLike);
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
					+ " price3exGST, qty_break4, price4exGST, avg_cost, tax_code, created_by,product_group_code,qty_break0,gst_flag) "
					+ " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?,?,?)";
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
				+ " ifnull(gst_flag, 'No') gst_flag "
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
				+ " ifnull(gst_flag, 'No') gst_flag "
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
			}
			ArrayList<AlternateProductBean> arrayAlternateProductBeans=new ArrayList<AlternateProductBean>();
			boolean isAltAdded=false;
			arrayAlternateProductBeans=getAlternatives(productCode);
			if(arrayAlternateProductBeans.size()>0){
				isAltAdded=true;
			}
			if (isAltAdded) {
//				System.out.println("If rs.next");
//				objBean.setAlternativeProductAdded(true);	
				objBean.setAlternativeProducts(arrayAlternateProductBeans);
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
	public ArrayList<AlternateProductBean> getAlternatives(String productCode) {
		System.out.println("GET Alternatives...");
		System.out.println("Product Code"+productCode);
		ArrayList<AlternateProductBean> arrayAlternateProductBeans=new ArrayList<AlternateProductBean>();
		String getAlternatives="SELECT a.alternative_product_id 'alt_product_id', "
				+ "p.item_description 'alt_item_desc',p.description2 'alt_item_desc2',p.description3 'alt_item_desc3',"
				+ "p.avg_cost 'alt_avg_cost',p.unit 'alt_unit',p.price0exGST 'alt_price0exGST',"
				+ "p.price1exGST 'alt_price1exGST',p.price2exGST 'alt_price2exGST',p.price3exGST 'alt_price3exGST',"
				+ "p.price4exGST 'alt_price4exGST',p.gst_flag 'alt_gst_flag' "
				+ "FROM alternative_product_master a, product_master p "
				+ "WHERE a.main_product_id = ? AND p.item_code=a.alternative_product_id;";
		
		try {
			pstmt = conn.prepareStatement(getAlternatives);
			pstmt.setString(1, productCode);
			rs = pstmt.executeQuery();
			AlternateProductBean objAltBean=null;
			while (rs.next()) {
				objAltBean=new AlternateProductBean();
				objAltBean.setAltProductCode(rs.getString("alt_product_id"));
//				System.out.println("alt_product_id >>"+rs.getString("alt_product_id"));
				objAltBean.setAltProductDesc(rs.getString("alt_item_desc"));
				objAltBean.setAltProductDesc2(rs.getString("alt_item_desc2"));
				objAltBean.setAltProductDesc3(rs.getString("alt_item_desc3"));
				objAltBean.setAltProductAvgCost(rs.getDouble("alt_avg_cost"));
				objAltBean.setAltProductUnit(rs.getString("alt_unit"));
				objAltBean.setAltProductPrice0exGST(rs.getDouble("alt_price0exGST"));
				objAltBean.setAltProductPrice1exGST(rs.getDouble("alt_price1exGST"));
				objAltBean.setAltProductPrice2exGST(rs.getDouble("alt_price2exGST"));
				objAltBean.setAltProductPrice3exGST(rs.getDouble("alt_price3exGST"));
				objAltBean.setAltProductPrice4exGST(rs.getDouble("alt_price4exGST"));
				objAltBean.setAltProductGstFlag(rs.getString("alt_gst_flag"));
				arrayAlternateProductBeans.add(objAltBean);
			}
			System.out.println("GET Alternatives List Size ..."+arrayAlternateProductBeans.size());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return arrayAlternateProductBeans;
	}
	public boolean updateProduct(ProductBean objBean) {
		boolean isCustomerUpdated = false;
		try {
			String updateCustQuery = "UPDATE product_master SET item_code = ?, item_description = ?, description2 = ?, "
					+ " description3 = ?, unit = ?, price0exGST = ?, qty_break1 = ?, price1exGST = ?, qty_break2 = ?, "
					+ " price2exGST = ?, qty_break3 = ?, price3exGST = ?, qty_break4 = ?, price4exGST = ?, avg_cost = ?, "
					+ " tax_code = ?, created_by = 0, product_group_code = ?, qty_break0 = ?, gst_flag = ?" + " WHERE item_code = ? ";
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
			pstmt.setString(20, objBean.getItemCode());

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
					+ " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?,?)";
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
				pstmt.setDouble(15, productList.get(i).getAvgcost());
				pstmt.setString(16, productList.get(i).getTaxCode());
				pstmt.setDouble(17, productList.get(i).getQtyBreak0());
				pstmt.setString(18, productList.get(i).getProductGroupCode());
				String taxCode=productList.get(i).getTaxCode();
				if (taxCode.equalsIgnoreCase("E")) {
					System.out.println("TAXCODE NO: "+ taxCode);
					pstmt.setString(19,"NO");
				} else {
					System.out.println("TAXCODE YES: "+ taxCode);
					pstmt.setString(19,"YES");
				}
//				pstmt.setString(19,"YES");
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

	public boolean deletedPreviousProduct(String productCodeString) {
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
				+ " ifnull(avg_cost, '0.0') avg_cost, ifnull(tax_code, '') tax_code, created_by , product_group_name, pm.product_group_code,gst_flag "
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
				+ " ifnull(avg_cost, '0.0') avg_cost, ifnull(tax_code, '') tax_code, created_by , product_group_name, pm.product_group_code,gst_flag "
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
