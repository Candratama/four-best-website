"use client";

import { motion } from "framer-motion";
import TeamCard, { TeamMember } from "@/components/cards/TeamCard";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface TeamProps {
  subtitle?: string;
  title?: string;
  members: TeamMember[];
}

export default function Team({
  subtitle = "Our Team",
  title = "Meet the Team",
  members,
}: TeamProps) {
  return (
    <section className="relative overlay-dark-1">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6 offset-lg-3 text-center">
            <motion.div
              className="subtitle"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {subtitle}
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h2>
          </div>
        </div>
        <motion.div
          className="row g-4"
          variants={staggerContainer(0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              className="col-lg-3 col-md-6"
              variants={fadeInUp}
              transition={{ delay: index * 0.3 }}
            >
              <TeamCard member={member} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
