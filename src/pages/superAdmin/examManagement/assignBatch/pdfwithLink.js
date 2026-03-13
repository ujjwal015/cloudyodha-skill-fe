import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.registerHyphenationCallback((word) => {
  return [word];
});

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    flexWrap: "wrap",
    minWidth: 0,
    flexShrink: 1,
    overflow: "hidden",
  },
  headerText: {
    fontWeight: "bold",
  },
  sr: { width: "5%" },
  name: { width: "12%" },
  username: { width: "10%" },
  password: { width: "8%" },
  mobile: { width: "11%" },
  candidateId: { width: "11%" },
  batchId: { width: "12%" },
  email: { width: "10%" },
  link: {
    width: "20%",
  },
});

function formatLinkForPdf(url = "") {
  return `${url}`;
}

const MyPdfDocument = ({ data = [] }) => {
  const hasLink = data?.some((item) => !!item.link);

  const columns = [
    { label: "Sr No.", style: styles.sr },
    { label: "Candidate Name", style: styles.name },
    { label: "Username", style: styles.username },
    { label: "Password", style: styles.password },
    { label: "Mobile No", style: styles.mobile },
    { label: "Candidate Id", style: styles.candidateId },
    { label: "Batch Id", style: styles.batchId },
    { label: "Email Id", style: styles.email },
    ...(hasLink ? [{ label: "Link", style: styles.link }] : []),
  ];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page} wrap>
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            {[
              { label: "Sr No.", style: styles.sr },
              { label: "Candidate Name", style: styles.name },
              { label: "Username", style: styles.username },
              { label: "Password", style: styles.password },
              { label: "Mobile No", style: styles.mobile },
              { label: "Candidate Id", style: styles.candidateId },
              { label: "Batch Id", style: styles.batchId },
              { label: "Email Id", style: styles.email },
              ...(hasLink ? [{ label: "Link", style: styles.link }] : []),
            ]
              ?.filter(Boolean)
              ?.map((col, idx) => (
                <Text
                  key={idx}
                  style={[styles.tableCol, col.style, styles.headerText]}
                >
                  {col.label}
                </Text>
              ))}
          </View>

          {/* Data Rows */}
          {data?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.sr]}>{index + 1}</Text>
              <Text style={[styles.tableCol, styles.name]}>{item.name}</Text>
              <Text style={[styles.tableCol, styles.username]}>
                {item.userName}
              </Text>
              <Text style={[styles.tableCol, styles.password]}>
                {item.rawPassword}
              </Text>
              <Text style={[styles.tableCol, styles.mobile]}>
                {item.mobile || "-"}
              </Text>
              <Text style={[styles.tableCol, styles.candidateId]}>
                {item.candidateId}
              </Text>
              <Text style={[styles.tableCol, styles.batchId]}>
                {item.batchId}
              </Text>
              <Text style={[styles.tableCol, styles.email]}>
                {item.email || "-"}
              </Text>
              {hasLink && (
                <Text
                  wrap
                  style={[styles.tableCol, styles.link, { flexWrap: "wrap" }]}
                >
                  {formatLinkForPdf(item.link) || "-"}
                </Text>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default MyPdfDocument;
