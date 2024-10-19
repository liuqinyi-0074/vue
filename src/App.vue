<template>
  <div id="app" ref="document">
    <div id="element-to-convert">
      <center>
        <img width="400" src="./path-or-url" alt="Placeholder Image" />
        <h3>This content will be exported to PDF!</h3>
      </center>
    </div>
    <button @click="exportToPDF" class="btn btn-primary mt-3">Export to PDF</button>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";

export default {
  name: "App",
  methods: {
    exportToPDF() {
      const element = document.getElementById("element-to-convert"); // Get the element to export
      const options = {
        margin: 1,
        filename: "generated-pdf.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      };

      html2pdf().from(element).set(options).save(); // Generate PDF and download it
    },
  },
};
</script>

<style>
#app {
  margin-top: 60px;
  text-align: center;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}
</style>