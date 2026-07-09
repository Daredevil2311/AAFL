# 📋 Attack Data Template

## How to Add Your Attack Results

You mentioned you have results for **Free-Ride** and **Backdoor** attacks already, and need to add **Scaling** and **Label-Flip** attacks.

Here's the exact format needed:

---

## 📊 Data Format

For each attack, provide these metrics:

### Required Metrics:
```json
{
  "attackType": "Attack Name",
  "cleanMetrics": {
    "accuracy": 0.84,    // 0.0 to 1.0
    "precision": 0.61,   // 0.0 to 1.0
    "recall": 0.69,      // 0.0 to 1.0
    "f1": 0.65,          // 0.0 to 1.0
    "auc": 0.93          // 0.0 to 1.0
  },
  "attackedMetrics": {
    "accuracy": 0.76,    // Lower than clean
    "precision": 0.48,   // Lower than clean
    "recall": 0.58,      // Lower than clean
    "f1": 0.52,          // Lower than clean
    "auc": 0.88          // Lower than clean
  },
  "metricDrops": {
    "accuracy": -0.08,   // cleanMetrics.accuracy - attackedMetrics.accuracy
    "precision": -0.13,  // Negative values
    "recall": -0.11,
    "f1": -0.13,
    "auc": -0.05
  },
  "detectionAccuracy": 0.92,      // How well you detected the attack (0.0-1.0)
  "attackSuccessRate": 0.78       // How successful the attack was (0.0-1.0)
}
```

### Optional Attack-Specific Metrics:

**For Sybil Attack:**
```json
{
  "clusterSize": 3,              // Number of Sybil nodes
  "sybilInfluence": 0.65         // Influence percentage (0.0-1.0)
}
```

**For Backdoor Attack:**
```json
{
  "backdoorSuccessRate": 0.89    // Backdoor trigger success (0.0-1.0)
}
```

---

## 🎯 Example: Label-Flip Attack

Please provide your actual values in this format:

```json
{
  "attackType": "Label Flip Attack",
  "cleanMetrics": {
    "accuracy": ???,    // Your clean model accuracy
    "precision": ???,   // Your clean model precision
    "recall": ???,      // Your clean model recall
    "f1": ???,          // Your clean model F1
    "auc": ???          // Your clean model AUC
  },
  "attackedMetrics": {
    "accuracy": ???,    // After label-flip attack
    "precision": ???,
    "recall": ???,
    "f1": ???,
    "auc": ???
  },
  "metricDrops": {
    "accuracy": ???,    // clean - attacked (negative value)
    "precision": ???,
    "recall": ???,
    "f1": ???,
    "auc": ???
  },
  "detectionAccuracy": ???,      // 0.0 to 1.0
  "attackSuccessRate": ???       // 0.0 to 1.0
}
```

---

## 🎯 Example: Scaling Attack

```json
{
  "attackType": "Scaling Attack",
  "cleanMetrics": {
    "accuracy": ???,
    "precision": ???,
    "recall": ???,
    "f1": ???,
    "auc": ???
  },
  "attackedMetrics": {
    "accuracy": ???,
    "precision": ???,
    "recall": ???,
    "f1": ???,
    "auc": ???
  },
  "metricDrops": {
    "accuracy": ???,
    "precision": ???,
    "recall": ???,
    "f1": ???,
    "auc": ???
  },
  "detectionAccuracy": ???,
  "attackSuccessRate": ???
}
```

---

## 📝 Where to Add This Data

### Option 1: Update Backend (Recommended)
File: `backend/app/routes/mock_job.py`

Find the `STATIC_RESULTS` dictionary and update:

```python
STATIC_RESULTS = {
    "label-flip": {
        # Your label-flip data here
    },
    "scaling": {
        # Your scaling data here
    },
    # ... other attacks
}
```

### Option 2: Provide Values Here
Just fill in the ??? with your actual values and I'll update the code for you.

---

## 🔢 How to Calculate Metric Drops

```python
metricDrops = {
    "accuracy": cleanMetrics["accuracy"] - attackedMetrics["accuracy"],
    "precision": cleanMetrics["precision"] - attackedMetrics["precision"],
    "recall": cleanMetrics["recall"] - attackedMetrics["recall"],
    "f1": cleanMetrics["f1"] - attackedMetrics["f1"],
    "auc": cleanMetrics["auc"] - attackedMetrics["auc"]
}
```

All drops should be **negative** values (since attacked is worse than clean).

---

## 📊 Additional Data for More Visualizations

If you want to add the **3 recommended visualizations**, also provide:

### 1. Time Series Data (Performance over rounds)
```json
{
  "roundMetrics": {
    "clean": [0.65, 0.70, 0.75, 0.78, 0.80, 0.82, 0.83, 0.84, 0.84, 0.84],
    "attacked": [0.65, 0.70, 0.72, 0.73, 0.74, 0.74, 0.75, 0.75, 0.76, 0.76]
  }
}
```
- Array of 10 values (one per round)
- Clean should improve over time
- Attacked should plateau or degrade

### 2. Client Contribution Data (Heatmap)
```json
{
  "clientMetrics": [
    {"clientId": 0, "accuracy": 0.85, "precision": 0.62, "recall": 0.70, "f1": 0.66, "auc": 0.93},
    {"clientId": 1, "accuracy": 0.45, "precision": 0.30, "recall": 0.35, "f1": 0.32, "auc": 0.65},
    // ... for all 10 clients
  ],
  "maliciousClients": [1, 3]  // Which clients were attackers
}
```

### 3. Confusion Matrix
```json
{
  "confusionMatrix": {
    "clean": [[850, 50], [30, 870]],      // [[TN, FP], [FN, TP]]
    "attacked": [[800, 100], [80, 820]]   // Worse performance
  }
}
```

---

## 🎨 Visualization Examples

Once you provide the data, you'll get:

### Bar Chart:
![Bar Chart Example](https://via.placeholder.com/600x300/1c2128/10b981?text=Metrics+Comparison)

### Radar Chart:
![Radar Chart Example](https://via.placeholder.com/400x400/1c2128/ef4444?text=Radar+Comparison)

### Gauges:
![Gauge Example](https://via.placeholder.com/300x200/1c2128/3b82f6?text=Detection+92%25)

---

## ✅ Checklist

Before submitting your data, verify:

- [ ] All metrics are between 0.0 and 1.0
- [ ] Attacked metrics are lower than clean metrics
- [ ] Metric drops are negative values
- [ ] Detection accuracy is realistic (0.7-0.95)
- [ ] Attack success rate makes sense for your attack type
- [ ] All required fields are present

---

## 📤 How to Submit

**Option 1**: Paste your values in the chat
```
Label-Flip Attack:
- Clean Accuracy: 0.XX
- Attacked Accuracy: 0.XX
- ... etc
```

**Option 2**: Provide a JSON file

**Option 3**: Tell me the values and I'll format them

---

## 💡 Tips

### Realistic Values:
- **Clean Model**: 0.75-0.90 for most metrics
- **Attacked Model**: 10-30% worse than clean
- **Detection Accuracy**: 0.80-0.95 (good detection)
- **Attack Success Rate**: 0.60-0.90 (successful attack)

### Attack Severity:
- **Mild Attack**: 5-10% drop
- **Moderate Attack**: 10-20% drop
- **Severe Attack**: 20%+ drop

---

## 🚀 Quick Start

1. Find your attack results (CSV, logs, etc.)
2. Extract the 5 metrics for clean and attacked models
3. Calculate the drops
4. Estimate detection and success rates
5. Provide values in the format above
6. I'll update the code immediately!

---

**Need Help?** Just paste your raw results and I'll format them for you! 📊
