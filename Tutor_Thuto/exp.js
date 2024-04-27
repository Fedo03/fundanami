const { GenerativeModel, configure, get_file, upload_file, delete_file } = require('google-generativeai');
const { createHash } = require('crypto');
const fs = require('fs');

configure({ api_key: "AIzaSyBXFvjbENfAN3m-sr1ow_XKqRY1LDx9SVM" });

const generation_config = {
  temperature: 1,
  top_p: 0.95,
  top_k: 0,
  max_output_tokens: 8192
};

const safety_settings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  }
];

const model = new GenerativeModel({
  model_name: "gemini-1.5-pro-latest",
  generation_config,
  safety_settings
});

let uploadedFiles = [];

async function uploadIfNeeded(pathname) {
  const fileBuffer = fs.readFileSync(pathname);
  const hashId = createHash('sha256').update(fileBuffer).digest('hex');
  
  try {
    const existingFile = await get_file({ name: hashId });
    return [existingFile.uri];
  } catch (error) {
    // File doesn't exist, upload it
    const uploadedFile = await upload_file({
      path: pathname,
      display_name: hashId
    });
    uploadedFiles.push(uploadedFile);
    return [uploadedFile.uri];
  }
}

(async () => {
  const convo = await model.start_chat([
    {
      role: "user",
      parts: ["please create a tutor which takes a picture of class work and notes then provide an explaination and provide resources for youtube and books : yeah is an example picture "]
    },
    {
      role: "user",
      parts: await uploadIfNeeded("<path>/image0.png")
    },
    {
      role: "model",
      parts: ["## Understanding Organic Chemistry Functional Groups: A Tutor's Guide\n\nThe image you provided showcases a table of various organic functional groups, their structures, and examples. Let's break down each group and provide further explanation and resources:\n\n**Functional Group** | **Explanation** | **Examples** | **Resources**\n---|---|---|---\n**Carboxylic Acid** | Contains a carboxyl group (-COOH). Characterized by acidic properties. | Methanoic acid (HCOOH), Ethanoic acid (CH3COOH) | Khan Academy: Organic Chemistry, \"Organic Chemistry\" by Paula Yurkanis Bruice\n**Alcohols** | Contains a hydroxyl group (-OH) attached to a carbon chain. | Ethanol (CH3CH2OH), Propanol (CH3CH2CH2OH) | The Organic Chemistry Tutor (YouTube), \"Organic Chemistry\" by Vollhardt & Schore\n**Alkene** | Contains a carbon-carbon double bond (C=C). Undergoes addition reactions. | Ethene (CH2=CH2), Butene (CH3CH2CH=CH2) | Crash Course Organic Chemistry (YouTube), \"Organic Chemistry as a Second Language\" by David R. Klein\n**Alkyne** | Contains a carbon-carbon triple bond (C≡C). More reactive than alkenes. | Ethyne (HC≡CH), Butyne (CH3C≡CCH3) | Leah4sci (YouTube), \"Organic Chemistry\" by Kenneth L. Williamson\n**Aldehyde** | Contains a carbonyl group (C=O) bonded to a hydrogen atom. | Methanal (HCHO), Propanal (CH3CH2CHO) | Professor Dave Explains (YouTube), \"March's Advanced Organic Chemistry\"\n**Ketone** | Contains a carbonyl group (C=O) bonded to two carbon atoms. | Propanone (CH3COCH3), Butanone (CH3CH2COCH3) | The Chem Collective (website), \"Organic Chemistry\" by McMurry\n\n**Additional Tips:**\n\n* **Practice drawing structures:** Understanding the spatial arrangement of atoms is crucial in organic chemistry.\n* **Learn naming conventions:** IUPAC nomenclature is the standardized system for naming organic compounds.\n* **Recognize common reactions:** Familiarize yourself with reactions like addition, elimination, substitution, and oxidation-reduction.\n* **Utilize online resources:** Many websites and YouTube channels offer excellent organic chemistry tutorials and practice problems.\n\n**Remember:** Organic chemistry is a complex subject, but with dedication and the right resources, you can master it!"]
    }
  ]);

  convo.send_message("please provide an explanation and resources and books ");
  console.log(convo.last.text);

  // Clean up uploaded files
  for (const uploadedFile of uploadedFiles) {
    await delete_file({ name: uploadedFile.name });
  }
})();