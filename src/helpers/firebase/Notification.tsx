export const Notification = ({
  title,
  link,
}: {
  title: string;
  link: string;
}) => {
  const handleDownload = async () => {
    try {
      const fileURL = link;
      const linkElement = document.createElement("a");
      linkElement.href = fileURL;
      linkElement.target = "_blank";
      linkElement.download = "test.xlsx";
      linkElement.click();

      URL.revokeObjectURL(fileURL);
    } catch (error: any) {
      console.error(error);
    }
  };

  // const downloadExcelFile = async () => {
  //     try {
  //         const response = await axios.get(`${link}`, {
  //             responseType: 'blob',
  //         });

  //         const timestamp = new Date().getTime();
  //         const fileName = `excel_file_${timestamp}.xlsx`;

  //         const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  //         const links = document.createElement('a');
  //         links.href = window.URL.createObjectURL(blob);
  //         links.download = fileName;

  //         document.body.appendChild(links);
  //         links.click();

  //         document.body.removeChild(links);
  //     } catch (error) {
  //         console.error('Error downloading Excel file:', error);
  //     }
  // };
  return (
    <>
      <p>{title}</p>
      {/* <a href={link} target="_self" style={{ textDecoration: 'none' }} onClick={handleDownload}>Click here to download</a> */}
      <span onClick={handleDownload}>Click here to download</span>
    </>
  );
};

export default Notification;
