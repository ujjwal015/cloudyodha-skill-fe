import PropTypes from 'prop-types';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { binaryToBlobImageConverter } from '../../../../utils/binaryToBlobConverter';
import DummyUser from "../../../../assets/images/common/dummyUser.png"

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameSection: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    color: '#000000',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  halfWidth: {
    flex: 1,
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailsLabel: {
    fontWeight: 'bold',
    color: '#005BA2',
    width: 120,
  },
  detailsValue: {
    flex: 1,
    color: '#97A1AF',
  },
  largerTable: {
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 20,
    padding: 10,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#000',
    color: '#97A1AF',
  },
  lastCell: {
    borderRightWidth: 0,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#005BA2',
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    textAlign: 'center',
    color: '#97A1AF',
  },
});

// Resume PDF Component
  const  ResumePDF = ({ userData }) => {
  // const currentDate = new Date().toLocaleDateString();
  const { experience=[], agreement=[], education=[], jobRole=[], personalDetail={}} = userData;
  let allFieldMissing = experience?.length === 0 && agreement?.length === 0 && education?.length === 0 && jobRole?.length === 0;
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.profileImage} src={(userData?.profilePicture ? binaryToBlobImageConverter(userData?.profilePicture):DummyUser)} />
          <View style={styles.nameContainer}>
            <Text style={styles.nameSection}>{userData?.name}</Text>
          </View>
        </View>

        {/* Basic Info and Contact Info */}
        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            <Text style={styles.sectionHeader}>Basic Details</Text>
            {[{ label: 'AR ID (SIP)', value: userData?.basicInfo?.arId },
              { label: 'Assessor Mode', value: userData?.basicInfo?.assessorMode },
              { label: 'ToA Type', value: userData?.basicInfo?.toaType },
              { label: 'Scheme', value: userData?.basicInfo?.scheme },
            ].map(({ label, value }) => (
              <View style={styles.detailsRow} key={label}>
                <Text style={styles.detailsLabel}>{label}:</Text>
                <Text style={styles.detailsValue}>{value}</Text>
              </View>
            ))}
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.sectionHeader}>Contact Information</Text>
            {[{ label: 'Email Id', value: userData?.contactInfo?.email },
              { label: 'Phone', value: userData?.contactInfo?.phone },
              { label: 'Address', value: userData?.contactInfo?.address },
              { label: 'D.O.B', value: userData?.contactInfo?.dob },
              { label: 'Gender', value: userData?.contactInfo?.gender },
            ].map(({ label, value }) => (
              <View style={styles.detailsRow} key={label}>
                <Text style={styles.detailsLabel}>{label}:</Text>
                <Text style={styles.detailsValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Personal Details */}
        {Object.entries(personalDetail).length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Personal Details</Text>
            {[
              { label: 'Aadhaar Number', value: userData?.personalDetail.aadharCard === '-' ? '-' : userData?.personalDetail.aadharCard.slice(0, 7) + "XXXX" },
              { label: 'PAN Number', value: userData?.personalDetail.panCard === '-' ? '-' : userData?.personalDetail.panCard.slice(0, 5) + "XXXX" },
            ].map(({ label, value }) => (
              <View style={styles.detailsRow} key={label}>
                <Text style={styles.detailsLabel}>{label}:</Text>
                <Text style={styles.detailsValue}>{value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Larger Table Section */}
        {!allFieldMissing && (
          <View style={styles.largerTable}>
            {/* Experience */}
            {userData?.experience?.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>Experience</Text>
                <View style={styles.table}>
                  <View style={[styles.tableRow]}>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Organization</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Position</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader, styles.lastCell]}>Duration</Text>
                  </View>
                  {userData?.experience?.map((exp, idx) => (
                    <View style={styles.tableRow} key={idx}>
                      <Text style={styles.tableCell}>{exp.organization}</Text>
                      <Text style={styles.tableCell}>{exp.position}</Text>
                      <Text style={[styles.tableCell, styles.lastCell]}>{exp.duration}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Education */}
            {userData?.education?.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>Educational Details</Text>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Institution</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Degree</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader, styles.lastCell]}>Duration</Text>
                  </View>
                  {userData?.education?.map((edu, idx) => (
                    <View style={styles.tableRow} key={idx}>
                      <Text style={styles.tableCell}>{edu.organization}</Text>
                      <Text style={styles.tableCell}>{edu.position}</Text>
                      <Text style={[styles.tableCell, styles.lastCell]}>{edu.duration}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Agreement */}
            {userData?.agreement?.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>Agreement Details</Text>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Company Name</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader, styles.lastCell]}>Duration</Text>
                  </View>
                  {userData?.agreement?.map((agreement, idx) => (
                    <View style={styles.tableRow} key={idx}>
                      <Text style={styles.tableCell}>{agreement.companyName}</Text>
                      <Text style={[styles.tableCell, styles.lastCell]}>{agreement.duration}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Job Role */}
            {userData?.jobRole?.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>Job Role Certificate</Text>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Company Name</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader, styles.lastCell]}>Duration</Text>
                  </View>
                  {userData?.jobRole?.map((job, idx) => (
                    <View style={styles.tableRow} key={idx}>
                      <Text style={styles.tableCell}>{job.companyName}</Text>
                      <Text style={[styles.tableCell, styles.lastCell]}>{job.duration}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        {/* <Text style={styles.footer}>Generated on {currentDate}</Text> */}
      </Page>
    </Document>
  );
};

export default ResumePDF;

// PropTypes
ResumePDF.propTypes = {
  userData: PropTypes.shape({
    profilePicture: PropTypes.object,
    name: PropTypes.string.isRequired,
    basicInfo: PropTypes.shape({
      arId: PropTypes.string,
      assessorMode: PropTypes.string,
      toaType: PropTypes.string,
      scheme: PropTypes.string,
    }),
    contactInfo: PropTypes.shape({
      email: PropTypes.string,
      phone: PropTypes.string,
      address: PropTypes.string,
      dob: PropTypes.string,
      gender: PropTypes.string,
    }),
    experience: PropTypes.arrayOf(
      PropTypes.shape({
        organization: PropTypes.string,
        position: PropTypes.string,
        duration: PropTypes.string,
      })
    ),
    education: PropTypes.arrayOf(
      PropTypes.shape({
        organization: PropTypes.string,
        position: PropTypes.string,
        duration: PropTypes.string,
      })
    ),
    agreement: PropTypes.arrayOf(
      PropTypes.shape({
        companyName: PropTypes.string,
        duration: PropTypes.string,
      })
    ),
    jobRole: PropTypes.arrayOf(
      PropTypes.shape({
        companyName: PropTypes.string,
        duration: PropTypes.string,
      })
    ),
    personalDetail: PropTypes.object,
  }).isRequired,
};