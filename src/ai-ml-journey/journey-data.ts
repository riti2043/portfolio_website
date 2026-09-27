export type JourneyTier = 0 | 1 | 2 | 3;

export interface JourneyNode {
  id: string;
  parentId: string | null;
  name: string;
  tier: JourneyTier;
  description: string;
  tools?: string;
  outcome?: string;
}

const tierTwo = (
  id: string,
  parentId: string,
  name: string,
  description: string,
): JourneyNode => ({
  id,
  parentId,
  name,
  tier: 2,
  description,
});

const rootNode: JourneyNode = {
  id: 'root',
  parentId: null,
  name: 'AI/ML Brain',
  tier: 0,
  description: 'A living map from first principles to systems that learn, decide, generate, and act.',
};

const domains: JourneyNode[] = [
  { id: 'math', parentId: 'root', name: 'Math Foundations', tier: 1, description: 'The language beneath every model: vectors, uncertainty, geometry, and optimization.' },
  tierTwo('math-matrix-puzzle', 'math', 'The Matrix Puzzle', 'NumPy & Matplotlib'),
  tierTwo('math-notebook-ninja', 'math', 'Notebook Ninja', 'Jupyter fundamentals'),
  tierTwo('math-watch-reflect', 'math', 'Watch & Reflect', 'Intro to ML concepts'),

  { id: 'supervised', parentId: 'root', name: 'Supervised Learning', tier: 1, description: 'Learn mappings from labeled evidence, then test whether they survive contact with reality.' },
  tierTwo('supervised-linear-regression', 'supervised', 'Linear Regression from Scratch', 'Build the linear model from first principles.'),
  tierTwo('supervised-matlab-onramp', 'supervised', 'MATLAB ML Onramp', 'A hands-on introduction to machine learning in MATLAB.'),
  tierTwo('supervised-logistic-regression', 'supervised', 'Logistic Regression from Scratch', 'Heart Disease'),
  tierTwo('supervised-svm', 'supervised', 'SVM — Noise Robustness Testing', 'Test margin-based classification against noisy inputs.'),
  tierTwo('supervised-decision-tree', 'supervised', 'Decision Tree (ID3) + Fairness Analysis', 'Build ID3 and audit its decisions for fairness.'),
  tierTwo('supervised-knn', 'supervised', 'KNN with Ablation Study', 'Measure neighborhood sensitivity with controlled ablations.'),
  tierTwo('supervised-naive-bayes', 'supervised', 'Naive Bayes Classifier', 'Compare probabilistic classification assumptions.'),
  tierTwo('supervised-ensemble', 'supervised', 'Ensemble Learning', 'Random Forest, GBM, XGBoost'),

  { id: 'unsupervised', parentId: 'root', name: 'Unsupervised Learning', tier: 1, description: 'Find structure without labels: clusters, manifolds, and useful representations.' },
  tierTwo('unsupervised-anomaly', 'unsupervised', 'Anomaly Detection', 'Z-score, IQR, Isolation Forest, DBSCAN'),
  tierTwo('unsupervised-image-clustering', 'unsupervised', 'Image Clustering', 'K-Means on MNIST'),

  { id: 'deep', parentId: 'root', name: 'Neural Networks & Deep Learning', tier: 1, description: 'Compose differentiable layers, train them with care, and understand what they retain.' },
  tierTwo('deep-pytorch', 'deep', 'Intro to PyTorch', 'Tensors & Autograd'),
  tierTwo('deep-fundamentals', 'deep', 'Deep Learning Fundamentals', 'Activations, Optimizers, Regularization'),

  { id: 'nlp', parentId: 'root', name: 'NLP', tier: 1, description: 'Work with language as sequence, meaning, and a noisy interface between people and machines.' },
  tierTwo('nlp-sequence-modeling', 'nlp', 'Sequence Modeling', 'RNN vs LSTM'),
  tierTwo('nlp-transformer', 'nlp', 'Transformer-Based NLP', 'DistilBERT Fine-tuning'),

  { id: 'vision', parentId: 'root', name: 'Computer Vision', tier: 1, description: 'Teach systems to reason over pixels, geometry, and the visual world.' },
  tierTwo('vision-cnn-transfer', 'vision', 'CNN from Scratch + Transfer Learning', 'ResNet/VGG16'),

  {
    id: 'rl',
    parentId: 'root',
    name: 'Reinforcement Learning',
    tier: 1,
    description: 'An upcoming roadmap area for policies, rewards, exploration, and safe decision-making. Tier 2 topics will be added here next.',
  },

  { id: 'gen', parentId: 'root', name: 'Generative Models', tier: 1, description: 'Model how data is made, then sample new variations with control and restraint.' },
  tierTwo('gen-gans', 'gen', 'GANs', 'CIFAR-10/CelebA'),

  { id: 'mlops', parentId: 'root', name: 'Model Evaluation & MLOps', tier: 1, description: 'Make models observable, reproducible, and safe enough to operate over time.' },
  tierTwo('mlops-kaggle-crafter', 'mlops', 'Kaggle Crafter', 'Dataset Curation & Publishing'),
  tierTwo('mlops-data-detox', 'mlops', 'Data Detox', 'Data Cleaning with Pandas'),
  tierTwo('mlops-evaluation-metrics', 'mlops', 'Evaluation Metrics', 'Model Comparison'),
  tierTwo('mlops-hyperparameter-tuning', 'mlops', 'Hyperparameter Tuning', 'Grid/Random/Bayesian Search'),

  { id: 'agents', parentId: 'root', name: 'Agentic AI', tier: 1, description: 'Compose models, tools, memory, and feedback into systems that can take bounded action.' },
  tierTwo('agents-pdf-qa', 'agents', 'PDF Question Answering', 'LangChain RAG'),
];

export { rootNode };

export const journeyNodes: JourneyNode[] = [rootNode, ...domains];

export const journeyById = new Map(journeyNodes.map((node) => [node.id, node]));

export const childIds = (id: string): string[] =>
  journeyNodes.filter((node) => node.parentId === id).map((node) => node.id);

export const descendants = (id: string): Set<string> => {
  const result = new Set<string>();
  const pending = [...childIds(id)];
  while (pending.length) {
    const next = pending.pop()!;
    result.add(next);
    pending.push(...childIds(next));
  }
  return result;
};