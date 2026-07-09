# 📊 FedLearn Attack Simulator - Visualization Guide

## ✅ Implemented Visualizations

### 1. **Metrics Comparison Bar Chart**
- **What it shows**: Side-by-side comparison of Clean vs Attacked model performance
- **Metrics displayed**: Accuracy, Precision, Recall, F1 Score, AUC
- **Purpose**: Quickly see how the attack degraded model performance
- **Color coding**: Green (Clean), Red (Attacked)

### 2. **Performance Impact Bar Chart**
- **What it shows**: The drop in each metric caused by the attack
- **Metrics displayed**: Percentage drops in all 5 metrics
- **Purpose**: Identify which metrics were most affected
- **Color coding**: 
  - Red: Drop > 10% (severe)
  - Orange: Drop 5-10% (moderate)
  - Green: Drop < 5% (minor)

### 3. **Radar/Spider Chart**
- **What it shows**: Multi-dimensional comparison of model performance
- **Metrics displayed**: All 5 metrics on different axes
- **Purpose**: Visual pattern recognition of attack impact
- **Benefit**: Easy to see overall performance shape

### 4. **Detection Accuracy Gauge**
- **What it shows**: How well the system detected the attack
- **Range**: 0-100%
- **Purpose**: Measure defense effectiveness
- **Threshold**: 90% (shown as red line)

### 5. **Attack Success Rate Gauge**
- **What it shows**: How successful the attack was
- **Range**: 0-100%
- **Purpose**: Measure attack effectiveness
- **Interpretation**: Higher = more dangerous attack

### 6. **Summary Cards**
- **What they show**: Key metrics at a glance
- **Cards**: Detection Accuracy, Attack Success Rate, Accuracy Drop, F1 Drop
- **Purpose**: Quick overview before diving into details

---

## 🎯 Additional Visualizations You Can Add

### 7. **Time Series Line Chart** (Recommended)
**What to show**: Model performance degradation over federated learning rounds
```
- X-axis: Round number (1-10)
- Y-axis: Accuracy/F1 score
- Two lines: Clean model vs Attacked model
- Shows when attack impact becomes visible
```

**Implementation**:
```typescript
const timeSeriesData = {
  data: [
    {
      name: "Clean Model",
      x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      y: [0.65, 0.70, 0.75, 0.78, 0.80, 0.82, 0.83, 0.84, 0.84, 0.84],
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "#10b981" }
    },
    {
      name: "Attacked Model",
      x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      y: [0.65, 0.70, 0.72, 0.73, 0.74, 0.74, 0.75, 0.75, 0.76, 0.76],
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "#ef4444" }
    }
  ],
  layout: {
    title: "Performance Over Training Rounds",
    xaxis: { title: "Round" },
    yaxis: { title: "Accuracy", range: [0, 1] }
  }
}
```

### 8. **Heatmap of Client Contributions** (Recommended)
**What to show**: Which clients contributed most to model degradation
```
- Rows: Clients (0-9)
- Columns: Metrics (Accuracy, Precision, Recall, F1, AUC)
- Color: Red (malicious), Green (benign), Yellow (suspicious)
- Shows attack distribution across clients
```

**Implementation**:
```typescript
const heatmapData = {
  data: [{
    z: [
      [0.85, 0.62, 0.70, 0.66, 0.93], // Client 0 (benign)
      [0.45, 0.30, 0.35, 0.32, 0.65], // Client 1 (malicious)
      [0.83, 0.60, 0.68, 0.64, 0.92], // Client 2 (benign)
      // ... more clients
    ],
    x: ["Accuracy", "Precision", "Recall", "F1", "AUC"],
    y: ["Client 0", "Client 1", "Client 2", ...],
    type: "heatmap",
    colorscale: "RdYlGn"
  }],
  layout: {
    title: "Client Performance Heatmap"
  }
}
```

### 9. **Confusion Matrix** (Recommended)
**What to show**: Classification errors introduced by the attack
```
- 2x2 or NxN matrix depending on classes
- Shows True Positives, False Positives, True Negatives, False Negatives
- Compare Clean vs Attacked model confusion matrices side-by-side
```

**Implementation**:
```typescript
const confusionMatrixData = {
  data: [{
    z: [[850, 50], [30, 870]], // Clean model
    x: ["Predicted 0", "Predicted 1"],
    y: ["Actual 0", "Actual 1"],
    type: "heatmap",
    colorscale: "Blues",
    showscale: true
  }],
  layout: {
    title: "Confusion Matrix - Clean Model",
    xaxis: { side: "bottom" },
    yaxis: { autorange: "reversed" }
  }
}
```

### 10. **Box Plot for Metric Distribution**
**What to show**: Distribution of metrics across all clients
```
- Shows median, quartiles, outliers
- Helps identify anomalous clients
- Compare Clean vs Attacked distributions
```

### 11. **ROC Curve Comparison**
**What to show**: Receiver Operating Characteristic curves
```
- X-axis: False Positive Rate
- Y-axis: True Positive Rate
- Two curves: Clean vs Attacked
- Shows classification threshold impact
```

### 12. **Attack Impact Waterfall Chart**
**What to show**: Cumulative effect of attack on each metric
```
- Starting point: Clean model performance
- Each bar shows metric degradation
- Ending point: Final attacked model performance
- Visual flow of performance loss
```

---

## 🎨 Styling Recommendations

### Color Palette
- **Clean/Benign**: `#10b981` (green)
- **Attacked/Malicious**: `#ef4444` (red)
- **Warning**: `#f59e0b` (orange)
- **Info**: `#3b82f6` (blue)
- **Background**: `#0f1117` (dark)
- **Card**: `#1c2128` (slightly lighter)

### Chart Themes
```javascript
const darkTheme = {
  plot_bgcolor: "#0f1117",
  paper_bgcolor: "#1c2128",
  font: { color: "#e6edf3" },
  margin: { l: 60, r: 40, t: 60, b: 60 }
}
```

---

## 📈 Attack-Specific Visualizations

### For **Sybil Attack**:
- **Network Graph**: Show cluster of Sybil nodes
- **Influence Propagation**: How Sybil nodes affected aggregation

### For **Backdoor Attack**:
- **Trigger Visualization**: Show backdoor trigger pattern
- **Activation Heatmap**: When/where backdoor activates

### For **Label-Flip Attack**:
- **Label Distribution**: Before vs After attack
- **Flip Pattern Matrix**: Which labels were flipped to what

### For **Scaling Attack**:
- **Gradient Magnitude Chart**: Show scaled vs normal gradients
- **Weight Distribution**: Histogram of model weights

### For **Free-Ride Attack**:
- **Contribution Timeline**: Show which clients contributed vs free-rode
- **Workload Distribution**: Pie chart of actual work done

---

## 🚀 Implementation Priority

### High Priority (Add These First):
1. ✅ Time Series Line Chart - Shows attack progression
2. ✅ Heatmap of Client Contributions - Identifies malicious clients
3. ✅ Confusion Matrix - Shows classification errors

### Medium Priority:
4. Box Plot - Shows metric distribution
5. ROC Curve - Advanced performance analysis

### Low Priority (Nice to Have):
6. Waterfall Chart - Visual flow
7. Attack-specific custom visualizations

---

## 💡 Tips for Your Presentation

1. **Start with Summary Cards** - Give overview
2. **Show Main Bar Chart** - Clear comparison
3. **Drill into Radar Chart** - Pattern recognition
4. **Display Gauges** - Detection effectiveness
5. **End with Heatmap** - Identify attackers

This creates a logical flow from overview → details → insights.

---

## 🔧 Next Steps

To add more visualizations:

1. **Update backend** `STATIC_RESULTS` in `mock_job.py` to include:
   - `roundMetrics`: Array of metrics per round
   - `clientContributions`: Per-client performance data
   - `confusionMatrix`: Classification matrix

2. **Update frontend** `ResultsDashboard.tsx`:
   - Add new Plot components
   - Create new sections for each visualization
   - Use responsive grid layout

3. **Test with different attacks**:
   - Ensure each attack type shows relevant visualizations
   - Verify data accuracy

---

## 📊 Example: Adding Time Series Chart

### Backend (mock_job.py):
```python
"roundMetrics": {
    "clean": [0.65, 0.70, 0.75, 0.78, 0.80, 0.82, 0.83, 0.84, 0.84, 0.84],
    "attacked": [0.65, 0.70, 0.72, 0.73, 0.74, 0.74, 0.75, 0.75, 0.76, 0.76]
}
```

### Frontend (ResultsDashboard.tsx):
```typescript
{result.roundMetrics && (
  <div className="bg-card rounded-lg shadow-lg p-6">
    <Plot
      data={[
        {
          name: "Clean Model",
          x: Array.from({length: 10}, (_, i) => i + 1),
          y: result.roundMetrics.clean,
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "#10b981" }
        },
        {
          name: "Attacked Model",
          x: Array.from({length: 10}, (_, i) => i + 1),
          y: result.roundMetrics.attacked,
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "#ef4444" }
        }
      ]}
      layout={{
        title: "Performance Over Training Rounds",
        plot_bgcolor: "#0f1117",
        paper_bgcolor: "#1c2128",
        font: { color: "#e6edf3" },
        xaxis: { title: "Round" },
        yaxis: { title: "Accuracy", range: [0, 1] }
      }}
      config={{ responsive: true }}
      style={{ width: "100%", height: "400px" }}
    />
  </div>
)}
```

---

Good luck with your presentation! 🎉
