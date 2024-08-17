package nibm.hdse241.hospitalappointmentsystem.dto;

public class appointmentDTO {
    private int id;
    private String patientName;
    private String doctorName;
    private String patientMobile;
    private String patientEmail;
    private String appointmentTime;
    private String appointmentDate;
    private boolean appointmentStatus;
    public appointmentDTO() {
        id = 0; patientName = ""; doctorName = ""; patientMobile = ""; patientEmail = ""; appointmentTime = ""; appointmentDate = ""; appointmentStatus = false;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientMobile() {
        return patientMobile;
    }

    public void setPatientMobile(String patientMobile) {
        this.patientMobile = patientMobile;
    }

    public String getPatientEmail() {
        return patientEmail;
    }

    public void setPatientEmail(String patientEmail) {
        this.patientEmail = patientEmail;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(String appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public boolean isAppointmentStatus() {
        return appointmentStatus;
    }

    public void setAppointmentStatus(boolean appointmentStatus) {
        this.appointmentStatus = appointmentStatus;
    }
}
