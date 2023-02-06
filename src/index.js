const express = require('express');
const v1BandwidthRoutes = require('./v1/routes/bandwidthRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1/bandwidths', v1BandwidthRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 