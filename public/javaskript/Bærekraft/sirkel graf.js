const ctx = document.getElementById('matsvinnChart').getContext('2d');

// Plugin for midt-tekst
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart) {
    const { chartArea: { left, right, top, bottom } } = chart; // Henter midten av sirkelen
    const xCenter = (left + right) / 2; // X-koordinaten for midten
    const yCenter = (top + bottom) / 2; // Y-koordinaten for midten

    const ctx = chart.ctx;
    ctx.save();

    // Hovedtekst: "35"
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('82.3', xCenter, yCenter - 10); // Plassér litt over midten for plass til "kg"

    // Undertekst: "kg"
    ctx.font = '16px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('kg per innbygger', xCenter, yCenter + 15); // Plassér litt under hovedteksten

    ctx.restore();
  }
};

new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: [
      'Jordbruk (2022)',
      'Sjømat (2022)',
      'Matindustri (2022)',
      'Servering',
      'Husholdning',
      'Dagligvare (2022)',
      'KBS',
      'Undervisning- og omsorg (2022)',
      'Grossist'
    ],
    datasets: [{
      data: [21, 3, 16, 4, 42, 11, 1, 1, 1],
      backgroundColor: [
        '#FFD700', // Jordbruk
        '#00BFFF', // Sjømat
        '#1E90FF', // Matindustri
        '#FF6347', // Grossist
        '#FF4500', // Dagligvare
        '#DB7093', // Servering
        '#A020F0', // KBS
        '#ADFF2F', // Undervisning
        '#32CD32'  // Husholdninger
      ]
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right'
      },
      datalabels: {
        color: '#fff',
        font: {
          size: 12,
          weight: 'bold'
        },
        formatter: (value) => `${value}%`,
        anchor: 'center',
        align: 'center'
      }
    }
  },
  plugins: [centerTextPlugin, ChartDataLabels]
});
